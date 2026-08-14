---
name: memplace
description: Memory Placement & Gemini Notebook Memory Engine for Z8 E-Motion. Creates, manages, and connects project memories, knowledge items, and notebook specs.
---

# MemPlace - Gemini Memory & Knowledge Notebook Engine

`memplace` is the memory placement utility for the Z8 E-Motion project. It organizes architectural decisions, model specs, pricing matrices, and git rules into a structured project brain.

## Functions

1. **Place Memory (`memplace store`)**:
   - Saves structured key-value memories into `.agents/AGENTS.md` and `docs/BRAIN_NOTEBOOK.md`.
   - Indexes models, margins, wholesale prices, and component endpoints.

2. **Retrieve Memory (`memplace recall`)**:
   - Reads `.agents/AGENTS.md` and `docs/BRAIN_NOTEBOOK.md` to retrieve context without re-scanning the entire codebase.

3. **Notebook Binder (`memplace sync`)**:
   - Synchronizes workspace memories with Gemini / NotebookLM specs.
