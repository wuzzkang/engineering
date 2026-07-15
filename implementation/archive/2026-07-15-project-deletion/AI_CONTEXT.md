# AI Context

- **Feature:** Project Deletion Feature
- **Key Modules:**
  * Backend routing: `project.route.js`
  * Backend controller/orchestrator: `project.service.js`
  * Database handler: `supabase.service.js`
  * Frontend dashboard: `page.js`
  * Integration tests: `project-delete.integration.test.js`
- **Core Rules:** Ensure ownership validation is executed prior to deleting database records, releasing subdomains, or deleting assets. Default template assets under `/defaults/` must be ignored during deletion.
