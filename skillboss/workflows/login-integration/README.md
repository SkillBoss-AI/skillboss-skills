# Login Integration

Integrate user authentication into React apps deployed on Cloudflare Workers using the HeyBoss users-service.

## Prerequisites

- React app with a Cloudflare Worker backend
- Project deployed via `publish-worker`

## Workflow Overview

Login integration requires **two parts**:
1. **Backend (Worker)**: Auth API routes using `@hey-boss/users-service/backend`
2. **Frontend (React)**: Login UI using `@hey-boss/users-service/react`

---

## Part 1: Backend Setup (Worker)

### Step 1.1: Install Dependencies

Add these to your `package.json`:

```bash
npm install hono @hey-boss/users-service
```

### Step 1.2: Set Up Worker with Auth Routes

Copy the template from `./worker-template.ts` to your `src/index.ts`, or add these auth routes to your existing Worker:

**Required auth routes** (do not modify):
- `GET /api/oauth/google/redirect_url` - Get Google OAuth URL
- `POST /api/sessions` - Exchange OAuth code for session
- `GET /api/users/me` - Get current user
- `GET /api/logout` - Clear session
- `POST /api/send-otp` - Send email verification code
- `POST /api/verify-otp` - Verify code and create session

See `./worker-template.ts` for the complete implementation.

### Step 1.3: Configure wrangler.toml

Create a basic `wrangler.toml` (without `PROJECT_ID` for now):

```toml
name = "my-app"
main = "src/index.ts"
compatibility_date = "2024-01-01"
```

**Note**: The `PROJECT_ID` is auto-generated on first deployment. After running `publish-worker`, the script creates a `.skillboss` file containing the assigned `projectId`. You can then add it to `wrangler.toml`:

```toml
[vars]
PROJECT_ID = "skillboss-worker-xxxxxxxx"  # Get this from .skillboss after first deploy
```

The `PROJECT_ID` in `wrangler.toml` is optional - the deploy script will use the one from `.skillboss` if not specified. However, adding it to `wrangler.toml` makes the configuration explicit and version-controllable.

---

## Part 2: Frontend Setup (React)

### Step 2.1: Create AuthProtect Component

Create `src/react-app/components/AuthProtect.tsx`:

```tsx
import { useAuth } from '@hey-boss/users-service/react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AuthProtectProps {
  children: ReactNode;
}

export function AuthProtect({ children }: AuthProtectProps) {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### Step 2.2: Create OAuth Callback Page (REQUIRED for Google Login)

**IMPORTANT**: Google OAuth uses a popup flow. You need a dedicated callback page that runs inside the popup to handle the OAuth response.

Create `src/react-app/pages/AuthCallbackPage.tsx`:

```tsx
import { useEffect, useState } from 'react';

/**
 * OAuth Callback Handler for Popup Flow
 *
 * This page runs INSIDE the popup window after Google redirects back.
 * It exchanges the authorization code for a session, then closes the popup
 * and notifies the parent window.
 */
export function AuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange the code for a session token
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          credentials: 'include',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create session');
        }

        setStatus('success');

        // Notify the parent window that login succeeded
        if (window.opener) {
          window.opener.postMessage({ type: 'oauth-success' }, window.location.origin);
          window.close();
        } else {
          // If no opener (user navigated directly), redirect to home
          window.location.href = '/';
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Login failed');

        // Notify parent of failure
        if (window.opener) {
          window.opener.postMessage(
            { type: 'oauth-error', error: err instanceof Error ? err.message : 'Login failed' },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
    }}>
      {status === 'processing' && (
        <>
          <div className="spinner" />
          <p style={{ marginTop: '16px', color: '#666' }}>Completing login...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <p style={{ color: '#27ae60', fontSize: '18px' }}>Login successful!</p>
          <p style={{ color: '#666' }}>This window will close...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p style={{ color: '#e74c3c', fontSize: '18px' }}>Login failed</p>
          <p style={{ color: '#666' }}>{error}</p>
        </>
      )}
    </div>
  );
}
```

### Step 2.3: Create Login Page

Create `src/react-app/pages/LoginPage.tsx`:

```tsx
import { useAuth } from '@hey-boss/users-service/react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const { user, isPending, sendOTP, verifyOTP, refetch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('google');

  // Get redirect URL from location state
  const from = (location.state as any)?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isPending) {
      navigate(from, { replace: true });
    }
  }, [user, isPending, navigate, from]);

  // Listen for OAuth popup messages
  const handleOAuthMessage = useCallback(async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'oauth-success') {
      // Refresh auth state and redirect
      if (refetch) await refetch();
      navigate(from, { replace: true });
    } else if (event.data?.type === 'oauth-error') {
      setError(event.data.error || 'Google login failed');
      setLoading(false);
    }
  }, [from, navigate, refetch]);

  useEffect(() => {
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [handleOAuthMessage]);

  // Google OAuth with popup
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      // Get the OAuth redirect URL from backend
      // IMPORTANT: Only pass the origin, NOT the full callback path
      // The backend automatically appends /auth/callback
      const response = await fetch(
        `/api/oauth/google/redirect_url?originUrl=${encodeURIComponent(window.location.origin)}`
      );
      const data = await response.json();

      if (!data.redirectUrl) {
        throw new Error('Failed to get OAuth URL');
      }

      // Open popup window centered on screen
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        data.redirectUrl,
        'google-oauth',
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Monitor if user closes popup manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      setLoading(false);
    }
  };

  // Email OTP handlers
  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await sendOTP(email);
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await verifyOTP(email, otp);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="login-loading">Loading...</div>;
  }

  return (
    <div className="login-container">
      <h1>Login</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Login Method Toggle */}
      <div className="login-method-toggle">
        <button
          className={loginMethod === 'google' ? 'active' : ''}
          onClick={() => setLoginMethod('google')}
        >
          Google
        </button>
        <button
          className={loginMethod === 'email' ? 'active' : ''}
          onClick={() => setLoginMethod('email')}
        >
          Email
        </button>
      </div>

      {loginMethod === 'google' ? (
        <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      ) : (
        !otpSent ? (
          <div className="email-login">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div className="otp-verify">
            <p>Enter the code sent to {email}</p>
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              maxLength={6}
            />
            <button onClick={handleVerifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button onClick={() => setOtpSent(false)} className="back-btn" disabled={loading}>
              Use different email
            </button>
          </div>
        )
      )}
    </div>
  );
}
```

### Step 2.4: Create/Update Header Component

Create `src/react-app/components/Header.tsx`:

```tsx
import { useAuth } from '@hey-boss/users-service/react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="logo">Your App</div>

      {user ? (
        <div className="user-menu">
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </header>
  );
}
```

### Step 2.5: Configure Routing

Update `src/react-app/App.tsx`:

```tsx
import { AuthProvider } from '@hey-boss/users-service/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { Header } from './components/Header';
import { AuthProtect } from './components/AuthProtect';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* OAuth callback - MUST use AuthCallbackPage, NOT LoginPage */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthProtect>
                <HomePage />
              </AuthProtect>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## Part 3: Build and Deploy

```bash
# Build React app
npm run build

# Deploy Worker + React app together
node ./scripts/serve-build.js publish-worker . --name my-app
```

The `publish-worker` command automatically detects the `dist/` folder and deploys both the Worker API and React frontend together.

---

## How Google OAuth Popup Flow Works

Understanding the flow helps with debugging:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Login Page    │      │  Popup Window   │      │  Google OAuth   │
│  (parent window)│      │                 │      │                 │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │ 1. Click "Google Login"│                        │
         │───────────────────────>│                        │
         │    window.open()       │                        │
         │                        │ 2. Redirect to Google  │
         │                        │───────────────────────>│
         │                        │                        │
         │                        │ 3. User authenticates  │
         │                        │<───────────────────────│
         │                        │    (redirect with code)│
         │                        │                        │
         │                        │ 4. AuthCallbackPage    │
         │                        │    exchanges code      │
         │                        │    via POST /api/sessions
         │                        │                        │
         │ 5. postMessage()       │                        │
         │<───────────────────────│                        │
         │    {type: 'oauth-success'}                      │
         │                        │                        │
         │ 6. refetch() + navigate│ 7. window.close()     │
         │                        │                        │
```

**Key points:**
1. The popup opens Google's OAuth page
2. After user authenticates, Google redirects to `/auth/callback` **inside the popup**
3. `AuthCallbackPage` runs in the popup, exchanges the code for a session cookie
4. The popup sends a message to the parent window via `postMessage()`
5. The parent window receives the message, refreshes auth state, and navigates
6. The popup closes itself

---

## Testing the Auth Flow

After deployment, verify:
1. Visit `/login` - should see login page
2. Click "Continue with Google" - popup should appear
3. After Google auth - **popup should close automatically** and you're logged in
4. Test email OTP flow - enter email, receive code, verify
5. Visit protected route when logged out - should redirect to `/login`
6. When logged in, header shows email and logout button
7. Click logout - redirects to `/login`

---

## Critical Requirements

### Import Paths (MUST follow exactly)
```ts
// Backend (Worker)
import { ... } from '@hey-boss/users-service/backend';

// Frontend (React)
import { useAuth, AuthProvider } from '@hey-boss/users-service/react';
```

### useAuth() Hook Returns
| Property/Method | Purpose |
|-----------------|---------|
| `user` | Current user object (null if not logged in) |
| `isPending` | True while auth state is loading |
| `refetch()` | Refresh auth state (call after OAuth success) |
| `sendOTP(email)` | Sends verification code to email |
| `verifyOTP(email, otp)` | Verifies the email code |
| `logout()` | Signs out the user |

**Note**: Do NOT use `popupLogin()` - it doesn't properly handle the popup callback flow. Use the manual popup approach shown above.

### OAuth URL Parameter
When calling `/api/oauth/google/redirect_url`, pass **only the origin** (not the full callback path):

```ts
// CORRECT - backend appends /auth/callback automatically
`/api/oauth/google/redirect_url?originUrl=${encodeURIComponent(window.location.origin)}`

// WRONG - results in /auth/callback/auth/callback
`/api/oauth/google/redirect_url?originUrl=${encodeURIComponent(window.location.origin + '/auth/callback')}`
```

---

## File Structure

After implementing login:

```
project/
├── src/
│   ├── index.ts              # Worker with auth routes
│   └── react-app/
│       ├── App.tsx           # AuthProvider and routing
│       ├── pages/
│       │   ├── LoginPage.tsx       # Login page with Google + Email
│       │   ├── AuthCallbackPage.tsx # OAuth popup callback handler
│       │   └── ...
│       └── components/
│           ├── AuthProtect.tsx
│           ├── Header.tsx
│           └── ...
├── wrangler.toml             # Must include PROJECT_ID
└── package.json              # Must include hono, @hey-boss/users-service
```

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Popup blocked | Browser settings | Tell user to allow popups |
| Double `/auth/callback` in URL | Passing full callback path to OAuth | Only pass `window.location.origin` |
| Popup doesn't close | Missing `AuthCallbackPage` | Create the callback page component |
| Login succeeds but page doesn't update | Missing `postMessage` listener | Add message event listener in LoginPage |
| `sendOTP failed` | Invalid email | Check email format, retry |
| `verifyOTP failed` | Wrong/expired code | Request new OTP |
| `Unauthorized` on `/api/users/me` | Not logged in | Expected behavior |

---

## Customization Rules

### Can Modify
- Styles: All CSS classes, colors, layouts
- Text: Button labels, error messages
- UI: Add branding, logos, additional sections

### Cannot Modify
- Auth route paths (`/api/oauth/...`, `/api/sessions`, etc.)
- `AuthCallbackPage` core logic (code exchange, postMessage, window.close)
- Import sources (must be `@hey-boss/users-service/...`)
- Routing: `/login` and `/auth/callback` must remain public

---

## Tips

- Always set up the **backend auth routes first** before the React frontend
- Use the `worker-template.ts` as a starting point for new projects
- The `authMiddleware` can protect any Worker route that requires login
- Run `npm run build` before deploying to update the `dist/` folder
- Check browser console for auth errors during development
- If OAuth isn't working, check the Network tab for the redirect URL - it should be `/auth/callback?code=...` (not doubled)
