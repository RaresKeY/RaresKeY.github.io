# Project Instructions

This repository is the public deployment mirror for the Rares P. portfolio.

## Public Boundary

- Treat every committed file and every Git revision as public.
- Keep private authoring material, source-repository history, credentials,
  local paths, job research, and unpublished CV variants out of this repo.
- `site/` is a reviewed deployment artifact. Replace it only from a verified
  public bundle; do not mix authoring files into it.
- GitHub Pages must publish only `site/`, not the repository root.

## Specs

- Read `specs/_readme.md` and the relevant spec before changing deployment,
  verification, or the public-artifact boundary.
- Update the owning spec in the same change when its contract changes.
- Keep `specs/` committed and outside the Pages artifact.

## Verification

Run before every publication:

```bash
python scripts/check_public_bundle.py
deno check site/script.js
git diff --check
```
