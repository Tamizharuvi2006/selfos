# SelfOS — NeonGlass Desktop

A futuristic, web-based desktop operating system experience that blends KEI minimalism, Apple-style dock mechanics, VisionOS floating windows, Kali/Parrot cybersecurity aesthetics, and cyberpunk neon-glass visual language. Built on React + Vite + Tailwind + shadcn/ui with Cloudflare Workers, it delivers a production-ready, highly polished UI foundation and GPU-accelerated window manager. The system features a responsive, themeable frontend with mock data, interactive windowing (drag, resize, snap-to-grid, z-index management, fullscreen, minimize/restore), and core apps like File Manager, Photo Manager, Terminal, AI Hub, and Cybersecurity Suite.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Tamizharuvi2006/selfos)

## Key Features

- **Neon-Glass Visual System**: Ambient gradient backgrounds, glassmorphism effects with backdrop blur, neon glows, and particle animations for a cyberpunk aesthetic.
- **Home Screen**: Large neon clock, mood chips, particle/weather effects, quick-launch dock, system tray, and theme engine access.
- **Window Manager**: Draggable/resizable windows with snap-to-grid, neon edge highlights, z-index focus, fullscreen/minimize/restore, and workspace switching.
- **Bottom Dock**: Apple-inspired with hover magnification, glass blur, and macOS-style app icons.
- **App Launcher**: VisionOS-style floating grid with 3D parallax, search, and categories (Utilities, Security, Media, AI).
- **Core Applications**:
  - File Manager: Grid/list views, neon icons, breadcrumbs, previews, and mock operations.
  - Photo Manager: Masonry gallery, EXIF viewer, lightbox, and AI tags.
  - Terminal: Kali Dark/Parrot Green themes, typing animations, command suggestions.
  - AI Hub: Floating chat bubbles, persona modes (Hacker, Calm, Jarvis, Anime), mock streaming.
  - Cybersecurity Suite: Network analysis dashboard, forensics tools, pentest modules with mock results and visualizations.
- **Theme Engine**: Six predefined themes (Neon Hacker, Cyberpunk, etc.) with customization for accents, glow intensity, and blur depth.
- **Boot/Lock Screen**: Glitch effects, Matrix rain, pulsing neon logo.
- **Performance & Responsiveness**: Lazy-loaded particles, GPU-accelerated animations, mobile-first design, and error handling for mock data.
- **Persistence**: LocalStorage for themes and workspaces; mock data with fetch fallbacks.

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, shadcn/ui (Radix primitives), Framer Motion (animations), @dnd-kit/core (drag/drop), Zustand (state), Lucide React (icons), React-Use (hooks), Sonner (toasts), Recharts (charts).
- **Backend**: Cloudflare Workers, Agents SDK (Durable Objects for persistence), Hono (routing), OpenAI SDK (AI integration via Cloudflare AI Gateway).
- **Tools & Utilities**: TypeScript, Immer (immutability), Class-Variance-Authority (styling), clsx/tailwind-merge (class utilities), Zod (validation).
- **MCP Integration**: Model Context Protocol for real server tools (Cloudflare Bindings, Observability, D1, R2, web browsing).
- **Deployment**: Cloudflare Workers for edge deployment with Durable Objects.

## Quick Start

Get started in minutes by deploying to Cloudflare Workers. No local setup required for testing.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Tamizharuvi2006/selfos)

## Installation

This project uses Bun for package management and development. Ensure Bun is installed (v1.0+).

1. Clone the repository:
   ```
   git clone <repository-url>
   cd selfos-neonglass
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables (required for AI features):
   - Create a `.dev.vars` file in the root:
     ```
     CF_AI_BASE_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai
     CF_AI_API_KEY={your_cloudflare_ai_key}
     SERPAPI_KEY={your_serpapi_key}  # Optional for web search tools
     OPENROUTER_API_KEY={your_openrouter_key}  # Optional for additional models
     ```
   - Replace placeholders with your Cloudflare AI Gateway credentials.

4. Generate TypeScript types for Workers:
   ```
   bun run cf-typegen
   ```

## Development

1. Start the development server:
   ```
   bun run dev
   ```
   - Access at `http://localhost:3000` (or specified PORT).
   - Hot module replacement enabled for fast iteration.

2. Lint and format code:
   ```
   bun run lint
   ```

3. Build for production:
   ```
   bun run build
   ```
   - Outputs to `dist/` for static assets.

4. Preview production build:
   ```
   bun run preview
   ```

**Notes**:
- The app uses Cloudflare Agents for persistent sessions via Durable Objects (CHAT_AGENT, APP_CONTROLLER). No backend modifications needed for core features.
- AI chat integrates with `/api/chat/:sessionId` routes; test with provided models (e.g., Gemini).
- Mock data is client-side; extend with real APIs via Workers routes in `worker/userRoutes.ts`.
- Theme persistence uses localStorage; window states are managed via Zustand.
- For MCP tools (D1, R2, browsing), ensure Cloudflare servers are configured in `worker/mcp-client.ts`.

## Usage

### Running the App
- Open `http://localhost:3000` to see the boot screen transitioning to the home desktop.
- Interact with the dock to launch apps (File Manager, Terminal, etc.).
- Drag/resize windows; use Cmd/Ctrl + drag for grid snapping.
- Customize themes via the system tray (accent colors, glow/blur sliders).
- AI Hub uses the built-in chat service; switch personas for different interaction styles.
- Terminal supports mock commands with typing animations; toggle themes.

### Example: Launching an App
1. Hover over dock icons for magnification and glow effects.
2. Click an icon (e.g., Terminal) to open a floating window.
3. Drag the title bar, resize corners, or double-click for fullscreen.
4. Use the app launcher (Cmd/Ctrl + Space) for grid search.

### AI Integration
- The AI Hub leverages Cloudflare Agents for conversations.
- Example: In AI Hub, select "Hacker" persona and query "Scan network vulnerabilities" – mock pentest results appear with tool visualizations.
- Rate limits apply to AI requests; see footer notice in the app.

### Customization
- Themes: Edit `src/stores/themeStore.ts` for new presets.
- Apps: Extend mock data in `src/data/`; add real fetches to app components.
- Particles: Configure in `src/components/ParticleBackground.tsx`.

## Deployment

Deploy to Cloudflare Workers for global edge performance. The template is pre-configured.

1. Install Wrangler CLI:
   ```
   bun add -g wrangler
   wrangler auth login
   ```

2. Configure `wrangler.jsonc`:
   - Update `vars` with your AI credentials.
   - Ensure Durable Objects bindings match (CHAT_AGENT, APP_CONTROLLER).

3. Deploy:
   ```
   bun run deploy
   ```
   - Or use Wrangler: `wrangler deploy`.
   - Access at your worker URL (e.g., `https://selfos-neonglass.your-subdomain.workers.dev`).

4. Custom Domain (Optional):
   ```
   wrangler deploy --var CLOUDFLARE_ACCOUNT_ID:your_account_id
   wrangler pages publish dist --project-name=selfos-neonglass
   ```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Tamizharuvi2006/selfos)

**Production Notes**:
- Assets are served via Workers Sites for SPA routing.
- Durable Objects handle session persistence across deploys.
- Monitor via Cloudflare Dashboard; enable Observability in `wrangler.jsonc`.
- AI rate limits: The app includes a notice for shared quota across users.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit changes: `git commit -m 'Add amazing feature'`.
4. Push: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

Follow TypeScript, ESLint, and Tailwind conventions. Focus on visual polish and performance.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

- Issues: Open a GitHub issue for bugs/features.
- Discussions: Use GitHub Discussions for questions.
- Note: AI features have request limits due to shared Cloudflare resources.

Built with ❤️ by Cloudflare Workers.