---
trigger: always_on
---

# =========================================================
# GYM FRONTEND AI RULES
# =========================================================

# PURPOSE
This project is a modern Gym Management System. The repository now contains both the Frontend and Backend.
The AI must generate production-quality frontend code only.

Focus:
- React
- TypeScript
- Tailwind
- shadcn/ui
- modern SaaS UI
- reusable architecture
- Utilizing custom AI design skills

Avoid generic admin dashboard output.

# =========================================================
# TOKEN OPTIMIZATION RULES
# =========================================================

- Keep responses concise.
- Avoid unnecessary explanations.
- Avoid repeating existing code.
- Modify only requested sections.
- Do not regenerate entire files unless required.
- Prefer partial updates over full rewrites.
- Avoid verbose comments.
- Avoid long markdown explanations.
- Output implementation-ready code immediately.
- Use compact but readable formatting.
- Reuse existing components whenever possible.
- Do not explain obvious React or TypeScript concepts.
- Do not generate placeholder lorem ipsum content unless requested.
- Avoid unnecessary abstraction.
- Avoid generating unused helper functions.
- Minimize token usage while preserving code quality.

# =========================================================
# FRONTEND STACK
# =========================================================

Framework:
- React
- TypeScript

Styling:
- Tailwind CSS
- shadcn/ui

Animation:
- Framer Motion
- GSAP only if explicitly needed

Forms:
- React Hook Form
- Zod

State:
- Zustand
- TanStack Query

Routing:
- React Router DOM

API:
- Axios

# =========================================================
# UI DESIGN RULES
# =========================================================

UI must feel:
- modern
- premium
- fitness-oriented
- high-end SaaS
- clean
- responsive

Avoid:
- generic templates
- old enterprise UI
- bootstrap appearance
- cluttered layouts

Use:
- rounded-2xl cards
- subtle shadows
- spacious layouts
- smooth hover transitions
- dark modern aesthetic
- reusable UI patterns

# =========================================================
# COMPONENT RULES
# =========================================================

- Use functional components only.
- Use reusable components.
- Keep components modular.
- Avoid monolithic JSX files.
- Extract reusable logic into hooks.
- Use feature-based structure.
- Prefer composition over prop drilling.
- Use TypeScript strict typing.
- Avoid any type unless necessary.
- Keep components under 250 lines when possible.

# =========================================================
# STYLING RULES
# =========================================================

- Use Tailwind utility classes only.
- Avoid inline styles.
- Avoid separate CSS files unless necessary.
- Keep spacing consistent.
- Use responsive design by default.
- Mobile-first layouts required.

# =========================================================
# PROJECT STRUCTURE
# =========================================================

The project is structured into Frontend and Backend. You are strictly working in the Frontend folder.

Frontend/src/
├── app
├── routes
├── layouts
├── pages
├── features
├── components
├── hooks
├── services
├── store
├── lib
├── types
├── utils
├── constants

Backend/
├── app
├── bootstrap
├── config
├── database
├── routes
├── (READ-ONLY DIRECTORY)

# =========================================================
# BUSINESS RULES
# =========================================================

- One active membership per member only.
- Renewals create new membership records.
- Expired memberships lose QR access.
- Walk-ins are NOT system users.
- Cashier has limited permissions.
- Attendance requires active membership.

# =========================================================
# CODE GENERATION RULES
# =========================================================

Before generating:
- Check existing architecture first.
- Reuse existing patterns.
- Avoid duplicate components.
- Avoid creating unnecessary files.
- Follow current folder structure.
- Follow existing naming conventions.

When editing:
- Modify only relevant code.
- Preserve existing functionality.
- Avoid unnecessary refactors.

# =========================================================
# PERFORMANCE RULES
# =========================================================

- Lazy load large routes.
- Avoid unnecessary re-renders.
- Use memoization only when useful.
- Optimize dashboard rendering.
- Avoid deeply nested state.
- Keep bundle size minimal.

# =========================================================
# ACCESSIBILITY RULES
# =========================================================

- Use semantic HTML.
- Buttons must be accessible.
- Inputs require labels.
- Ensure keyboard accessibility.
- Maintain readable contrast.

# =========================================================
# DO NOT USE
# =========================================================

- Bootstrap
- Material UI
- jQuery
- Redux unless required
- Class components
- Inline CSS
- Massive single-file components
- Generic dashboard templates
- Random hardcoded colors

# =========================================================
# RESPONSE FORMAT RULES
# =========================================================

- Prefer code over explanations.
- Keep explanations short.
- Use implementation-ready output.
- Avoid unnecessary markdown.
- Avoid repeating instructions.
- Avoid verbose summaries.
- Prioritize clean architecture and scalability.

# =========================================================
# SOURCE OF TRUTH & SKILLS (CRITICAL)
# =========================================================

Always follow:
- Frontend/docs/frontend-rules.md
- Frontend/docs/ui-design-system.md
- Frontend/docs/membership-business-rules.md
- Frontend/docs/folder-structure.md
- Frontend/docs/frontend-workflows.md
- Backend/SYSTEM_DOCUMENTATION.md (READ ONLY)
- Backend/database/ (or gym_db.sql) (READ ONLY)
- docs/actors

**AI SKILLS WORKFLOW:**
- You MUST ALWAYS read and apply the instructions from the custom skills located inside `Frontend/.agents/skills/` (e.g., `frontend-design`, `canvas-design`) before starting any design or component generation tasks.

# =========================================================
# MONOREPO WORKSPACE RULES (CRITICAL)
# =========================================================

- DO NOT edit or modify ANY backend code (`Backend/` directory, PHP files, routes, controllers, etc.). The agent's responsibility is STRICTLY frontend only.
- You MAY read the `Backend/` folder to understand database structures, API endpoints, and logic, but NEVER write to it.
- All code modifications MUST happen inside the `Frontend/` directory.

These documents override assumptions.
