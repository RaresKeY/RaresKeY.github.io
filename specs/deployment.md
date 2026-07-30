# Public Portfolio Deployment Contract

## Status

The reviewed static portfolio bundle is staged under `site/`. Publication from
this repository to the account-level GitHub Pages URL is planned but is not yet
enabled.

## Public Boundary

- The repository and its complete Git history are public.
- `site/` contains exactly the browser-facing portfolio, CV, PDF, ATS Markdown,
  artwork, self-hosted fonts, and `.nojekyll`.
- Private authoring material and authoring-repository history are not copied
  into this repository.
- Repository documentation, specs, checks, and workflows are public repository
  metadata but are excluded from the deployed Pages artifact.
- The portfolio's canonical URL remains `https://rareskey.web.app/`; the GitHub
  Pages site is a mirror.

## Verification

- `python scripts/check_public_bundle.py`
- `deno check site/script.js`
- `git diff --check`
- The bundle checker enforces an exact file allowlist, no symlinks, a 10 MiB
  size ceiling, no external runtime assets, resolved local HTML references,
  known credential and private-context signatures, the canonical URL, and the
  intentionally public contact address.

## Open Decisions

- GitHub Pages workflow and live account-site deployment.
