Phase 8 adds a simple pricing gate.

Included:
- Site-wide Free / Pro mode switch using environment variable
- PDF export locked on Free mode
- Upgrade prompt shown in builder
- Pricing page explains current mode
- Pro mode can be simulated locally

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. Add:
   NEXT_PUBLIC_ENABLE_PRO_MODE=false
6. npm run dev
