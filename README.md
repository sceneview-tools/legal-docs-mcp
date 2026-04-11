# legal-docs-mcp

[![npm version](https://img.shields.io/npm/v/legal-docs-mcp)](https://www.npmjs.com/package/legal-docs-mcp)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

> **Disclaimer:** Generated documents are templates for **informational purposes only**. They do not constitute legal advice. Always have a qualified lawyer review any legal document before use. See [TERMS.md](./TERMS.md) and [PRIVACY.md](./PRIVACY.md).

MCP server for generating legal documents — CGV, CGU, NDA, privacy policies, freelance contracts, and more. For freelancers, startups, and SMBs.

## 🚀 Pro Products

| Product | Price | Description |
|---------|-------|-------------|
| [MCP Creator Kit](https://buy.polar.sh/polar_cl_tb87ROB9Xn0c5aohdn3NvkTINDF1xjW5zpkg70UwmcF) | €29 | Everything to create your own MCP server — template, CLI, docs, examples |
| [SceneView Pro Starter Kit](https://buy.polar.sh/polar_cl_tb87ROB9Xn0c5aohdn3NvkTINDF1xjW5zpkg70UwmcF) | €49 | Complete Android 3D + AR app template — 4 screens, ready to customize |
| [SceneView MCP Pro](https://buy.polar.sh/polar_cl_tb87ROB9Xn0c5aohdn3NvkTINDF1xjW5zpkg70UwmcF) | €9.99/mo | Premium MCP tools and priority support |

⭐ [Sponsor on GitHub](https://github.com/sponsors/sceneview) — Help us build the future of 3D/AR development

## Quick Start

```bash
npx legal-docs-mcp
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "legal-docs": {
      "command": "npx",
      "args": ["-y", "legal-docs-mcp"]
    }
  }
}
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT — SceneView Tools
