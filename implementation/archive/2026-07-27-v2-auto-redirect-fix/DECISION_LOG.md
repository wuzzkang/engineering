# Decision Log — V2 Redirect Fix

1. **AST Node Detection**: V2 First Principles AST documents structure (`nodes`, `formatVersion`, `$schema`) must be explicitly detected by the `/generate` router alongside `template_version: 2`.
2. **Path Parameter Route**: The modern V2 Editor uses dynamic route parameters `/generate/v2/[projectId]` rather than query string parameters `/generate/v2?id=...`.
