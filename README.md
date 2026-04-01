# Claude Buddy

A desktop companion overlay for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that shows what your AI agent is doing in real time.

![Claude Buddy](https://img.shields.io/badge/claude--code-companion-blue) ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey) ![License](https://img.shields.io/badge/license-MIT-green)

## What It Does

Claude Buddy is a transparent, always-on-top desktop widget that sits in the corner of your screen and reacts to Claude Code's activity in real time. It shows you:

- What file Claude is reading or editing
- What commands are being run
- What websites are being fetched
- What searches are happening
- When Claude is idle vs actively working

No more staring at a terminal wondering what's happening. Your buddy tells you.

## How It Works

1. **Electron overlay** -- A frameless, transparent window with a CSS robot character
2. **WebSocket bridge** -- A lightweight hook script that Claude Code calls after every tool use
3. **Real-time updates** -- The robot's speech bubble updates with what Claude is doing, and its visual state changes between idle and active

```
Claude Code ──(PostToolUse hook)──> hook-bridge.js ──(WebSocket)──> Electron overlay
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed and working

### Setup

```bash
# Clone the repo
git clone https://github.com/strangeadvancedmarketing/claude-buddy.git
cd claude-buddy

# Install dependencies
npm install

# Start the buddy
npm start
```

### Connect to Claude Code

Add the hook to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/claude-buddy/hook-bridge.js",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Replace `/path/to/claude-buddy/` with the actual path where you cloned the repo.

That's it. Start Claude Code and your buddy will react to everything it does.

## Features

- **Transparent overlay** -- Sits on top of all windows, click-through on transparent areas
- **Draggable** -- Grab the robot to move it anywhere on screen
- **Tool-aware icons** -- Different icons for reading, writing, searching, browsing, etc.
- **Idle animations** -- Bobbing, eye movement, antenna wiggle, curious tilts when idle
- **Active state** -- Screen color changes when Claude is working
- **Lightweight** -- The hook script connects, sends one message, and exits in under 800ms

## Customization

### Change the WebSocket port

Default is `9876`. Edit both `main.js` (server) and `hook-bridge.js` (client) if you need a different port.

### Add more tool icons

Edit the `toolIcons` map in `index.html` to add icons for your custom MCP tools:

```javascript
const toolIcons = {
  Read: '📖',
  Write: '✏️',
  Bash: '⚡',
  // Add your own:
  mcp__my_tool__action: '🛠️',
};
```

### Modify the robot

The robot is pure CSS in `index.html`. Change colors, size, animations -- it's all there.

## Architecture

```
claude-buddy/
├── main.js          # Electron main process + WebSocket server
├── preload.js       # Secure IPC bridge
├── index.html       # Robot UI + event formatting logic
├── hook-bridge.js   # Claude Code hook → WebSocket sender
└── package.json
```

## Built By

[Strange Advanced Marketing](https://github.com/strangeadvancedmarketing) -- AI-powered business management tools.

Built by a non-developer using Claude Code. If you're interested in what a fully configured AI business partner looks like, check out the [Adam Framework](https://github.com/strangeadvancedmarketing/Adam).

## License

MIT -- do whatever you want with it.
