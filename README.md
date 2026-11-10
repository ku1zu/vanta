# Vanta
Prerequisites: Node 20+, pnpm (`corepack enable`).

    pnpm add -w react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing leva
    pnpm add -wD typescript vite @vitejs/plugin-react @types/react @types/react-dom @types/three
    pnpm dev        # http://localhost:5173 (also exposed on your LAN for phone testing)
    pnpm typecheck

URL options: `?tier=high|medium|low` forces a quality tier.

Material Lab: the dev panel (top right) is hidden in production builds. Pick an object under Material > target, then edit its sliders.
