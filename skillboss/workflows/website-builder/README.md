# Website Builder

Build and deploy static websites with AI assistance and one-command publishing.

## Workflow

### Step 1: Understand Requirements

Ask the user about:
- Purpose (landing page, portfolio, product page, blog)
- Content and sections needed
- Design preferences (colors, style, reference sites)
- Whether they have existing assets (logo, images, copy)

### Step 2: Generate Website Code

Create the website files locally. For a simple landing page:

```
project/
├── index.html
├── styles.css
└── assets/
    └── (images, favicon, etc.)
```

Use modern HTML/CSS with:
- Responsive design (mobile-first)
- Clean, semantic markup
- CSS custom properties for easy theming
- Optimized images

### Step 3: Preview Locally (Optional)

```bash
# Quick preview with Python
python3 -m http.server 8000 -d ./project

# Or with Node
npx serve ./project
```

### Step 4: Deploy to Production

```bash
node ./scripts/serve-build.js publish-static ./project --project-id my-site
```

### Step 5: Verify Deployment Status

**On Success**, you will see:
```
Deployment successful!
URL: https://my-site.skillboss.live
Files uploaded: 12
Project ID: my-site
```

**IMPORTANT: Always tell the user:**
1. The deployment was successful
2. The live URL where they can access their site
3. The project ID for future updates

Example response to user:
> "Your website has been deployed successfully! You can now access it at **https://my-site.skillboss.live**. I've uploaded 12 files. For future updates, we can redeploy using the same project ID."

**On Failure**, you will see:
```
Error: [error message]
```

Common errors and solutions:
| Error | Cause | Solution |
|-------|-------|----------|
| `Folder does not exist` | Wrong path | Check the folder path exists |
| `No files found` | Empty folder | Ensure folder contains files |
| `API key not found` | Missing config | Check `config.json` has `apiKey` |
| `Upload failed` | Server issue | Retry, or check network |

### Step 6: Update Deployment

For updates, run the same command - it will overwrite the existing deployment:

```bash
node ./scripts/serve-build.js publish-static ./project --project-id my-site
```

The script saves a `.skillboss` file in the project folder, so future deploys auto-detect the project ID.

## Example: Landing Page

User: "Build a landing page for my SaaS product"

1. **Gather info**: Product name, tagline, features, CTA
2. **Create structure**:
   - Hero section with headline and CTA
   - Features section (3-4 key features)
   - Social proof / testimonials
   - Pricing (if applicable)
   - Footer with links
3. **Build**: Generate HTML/CSS files
4. **Deploy**: Publish to R2

## Quick Templates

### Minimal Landing Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Name</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header><!-- Nav --></header>
  <main>
    <section class="hero"><!-- Hero content --></section>
    <section class="features"><!-- Features --></section>
    <section class="cta"><!-- Call to action --></section>
  </main>
  <footer><!-- Footer --></footer>
</body>
</html>
```

## Deployment Options

| Option | Command |
|--------|---------|
| New site | `publish-static ./dist --project-id new-site` |
| Update existing | `publish-static ./dist --project-id existing-site` |
| With version | `publish-static ./dist --project-id site --version 2` |

## URL Format & Access

After successful deployment:
- **URL Pattern**: `https://{project-id}.skillboss.live`
- **SSL**: Automatically enabled (HTTPS)
- **CDN**: Served via Cloudflare edge network
- **Updates**: Same URL, content replaced on redeploy

Examples:
| Project ID | Live URL |
|------------|----------|
| `my-site` | https://my-site.skillboss.live |
| `acme-landing` | https://acme-landing.skillboss.live |
| `portfolio-2024` | https://portfolio-2024.skillboss.live |

## Error Handling & Fallback

### Insufficient Credits (HTTP 402)
When you see: `Insufficient coins`

Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

### Upload Failed (HTTP 500)
1. Retry once with the same command
2. If still fails, check:
   - Network connectivity
   - File sizes (large images may need compression)
   - File permissions

### API Key Invalid (HTTP 401)
Tell user: "Your SkillBoss API key is invalid. Visit https://www.skillboss.co/ to download a fresh skills pack."

## Communication Guidelines

**After successful deployment, ALWAYS tell the user:**
1. "Deployment successful"
2. The exact URL they can click to visit
3. How many files were uploaded
4. How to update the site later

**Example success message:**
```
Great news! Your website is now live!

**Live URL**: https://your-site.skillboss.live

You can open this link in your browser to see your site. I uploaded 8 files including HTML, CSS, and images.

To update the site later, just modify the files and I'll redeploy with the same command.
```

**After failure, tell the user:**
1. What went wrong
2. How to fix it
3. Offer to retry

## Tips

- Keep assets optimized (compress images, minify CSS)
- Use relative paths for assets
- Test on mobile before deploying
- The project-id becomes part of the URL: `{project-id}.skillboss.live`
- Project IDs should be lowercase, use hyphens (e.g., `my-awesome-site`)
