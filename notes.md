# Maintenance Notes

## dan/maintenance — 2026-11-23

### What we did

#### Route wiring fix — `documentNotes.route.js`
- **Problem:** The route file was importing from the old `modules/documentnotes/controller`.
  The `commitModule` had a full set of controllers (add, get, update, delete) and Joi
  validation added in the previous feature commit, but the route never pointed at them —
  so `PUT /:id` (edit note) and `DELETE /:id` (soft-delete note) were completely unreachable.
- **Fix:** Switched the import to `modules/commitModule/controller` and
  `modules/commitModule/validation`. Added the missing PUT and DELETE routes, each
  wrapped with `validate()` middleware using the Joi schemas from `validation.js`.
- **Files changed:** `src/routes/v1/documentNotes.route.js`

### Why this was maintenance, not a feature
The controllers and services already existed from the previous feature commit. This was
purely a wiring step — connecting live code to the router so the endpoints could actually
be reached.
