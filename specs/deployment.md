# Public Portfolio Deployment Contract

## Status

The reviewed static portfolio bundle is staged under `site/`. GitHub Pages is
configured in Actions mode and `.github/workflows/deploy-pages.yml` validates
and publishes the bundle to `https://rareskey.github.io/` on pushes to `main`
or manual dispatch.

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

## Deployment

- GitHub Pages is configured with `build_type=workflow`.
- The build job checks out without persisted Git credentials, runs the public
  bundle validator, configures Pages, and uploads only `site/`.
- The deploy job receives only `pages: write` and `id-token: write`.
- Official GitHub actions are pinned to reviewed commit SHAs.

## Verification

- `python scripts/check_public_bundle.py`
- `deno check site/script.js`
- `git diff --check`
- The bundle checker enforces an exact file allowlist, no symlinks, a 10 MiB
  size ceiling, no external runtime assets, resolved local HTML references,
  known credential and private-context signatures, the canonical URL, and the
  intentionally public contact address.
