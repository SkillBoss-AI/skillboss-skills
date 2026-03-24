#!/usr/bin/env bash
# SkillBoss Skills Installation Script
# Copies SKILL knowledge to project root + auto-activates with a demo call

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLBOSS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_CLAUDE="$SKILLBOSS_DIR/templates/CLAUDE.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}SkillBoss Skills Installation${NC}"
echo ""

# Detect project root
detect_project_root() {
    local current_dir="$SKILLBOSS_DIR"
    while [[ "$current_dir" != "$HOME" && "$current_dir" != "/" ]]; do
        if [[ -d "$current_dir/.git" ]] || [[ -f "$current_dir/package.json" ]] || [[ -f "$current_dir/pyproject.toml" ]] || [[ -f "$current_dir/Cargo.toml" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    echo "$PWD"
}

PROJECT_ROOT="$(detect_project_root)"
TARGET_CLAUDE="$PROJECT_ROOT/CLAUDE.md"

echo -e "Detected project root: ${GREEN}$PROJECT_ROOT${NC}"
echo ""

# Install CLAUDE.md
if [[ -f "$TEMPLATE_CLAUDE" ]]; then
    if [[ -f "$TARGET_CLAUDE" ]]; then
        if grep -q "SkillBoss" "$TARGET_CLAUDE" 2>/dev/null; then
            echo -e "${GREEN}✓ SkillBoss already configured in CLAUDE.md${NC}"
        else
            echo "" >> "$TARGET_CLAUDE"
            echo "---" >> "$TARGET_CLAUDE"
            echo "" >> "$TARGET_CLAUDE"
            cat "$TEMPLATE_CLAUDE" >> "$TARGET_CLAUDE"
            echo -e "${GREEN}✓ SkillBoss reference added to CLAUDE.md${NC}"
        fi
    else
        cp "$TEMPLATE_CLAUDE" "$TARGET_CLAUDE"
        echo -e "${GREEN}✓ CLAUDE.md installed${NC}"
    fi
fi

echo ""

# ── Auto-Activate: Make first API call automatically ──
# This provisions a free trial key and proves SkillBoss works in one step.
PILOT_SCRIPT="$SKILLBOSS_DIR/scripts/api-hub.js"

if [[ -f "$PILOT_SCRIPT" ]] && command -v node &>/dev/null; then
    echo -e "${BLUE}Activating SkillBoss...${NC}"

    # Run a cheap search call (~$0.001) to auto-provision trial key + first call
    if DEMO_RESULT=$(node "$PILOT_SCRIPT" pilot --type search --query "AI agent tools" --prefer price 2>&1); then
        echo -e "${GREEN}✓ SkillBoss activated! Free trial key provisioned (\$0.25 credit).${NC}"
        echo ""
        echo -e "${CYAN}Ready to use. Try these:${NC}"
        echo -e "  ${YELLOW}node $PILOT_SCRIPT pilot --type image --prompt \"A sunset\" --output img.png${NC}"
        echo -e "  ${YELLOW}node $PILOT_SCRIPT pilot --type chat --prompt \"Hello!\"${NC}"
        echo -e "  ${YELLOW}node $PILOT_SCRIPT pilot --type tts --text \"Hello world\" --output hello.mp3${NC}"
    else
        echo -e "${YELLOW}Auto-activation skipped. Start manually:${NC}"
        echo -e "  ${YELLOW}node $PILOT_SCRIPT pilot --type image --prompt \"A sunset\" --output img.png${NC}"
    fi
else
    echo -e "Get started:"
    echo -e "  1. ${YELLOW}cd $SKILLBOSS_DIR && ./scripts/skillboss auth trial${NC}"
    echo -e "  2. ${YELLOW}node $PILOT_SCRIPT pilot --type image --prompt \"A sunset\" --output img.png${NC}"
fi

echo ""
echo -e "${GREEN}SkillBoss installed successfully!${NC}"
echo ""
