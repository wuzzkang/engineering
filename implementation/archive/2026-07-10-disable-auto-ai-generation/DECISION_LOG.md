# Decision Log - Disable Auto AI Page Gen & Allow Project Renaming

## 2026-07-10: Disable Automatic Full-Page AI Generation on Submit
- **Context**: Setting up a project (whether a draft or deployed) previously triggered a full-page AI generation queue job for templates like campaign, wedding, and birthday. This caused manual user edits to be completely overwritten when they clicked "Generate Preview" or published.
- **Decision**: Make the main action button (Generate Preview / Save Changes) behave uniformly as a direct save-and-preview button for all 5 template types.
- **Justification**: Users have fine-grained on-demand AI generators next to individual fields (e.g. Hero, Problems, Solutions). Keeping the main button clean and predictable gives users full control and prevents data loss.

## 2026-07-10: Disable Backend Auto-Renaming
- **Context**: The backend API `/projects/:id/edit-deployed` automatically renamed projects based on the headline or celebrant/groom names, ignoring the user's manual project rename actions in the dashboard.
- **Decision**: Accept an optional `name` parameter in the `/edit-deployed` API body. If passed, update the project name accordingly; otherwise, keep the current name intact. Remove content-based auto-renaming logic.
- **Justification**: Respects user naming choices and aligns dashboard labelling with user intent.
