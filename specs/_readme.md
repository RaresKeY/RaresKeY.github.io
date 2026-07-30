# RaresKeY GitHub Portfolio Specs Map

`specs/` is committed project memory for current intent and implementation. Read the relevant spec before changing its owning behavior, contract, boundary, source area, or verification flow, and update it with the implementation.

This repository contains only the reviewed public deployment artifact and the
public tooling and documentation required to publish it safely.

## Spec Map

| Spec | Owning sources | Scope | Read when |
|---|---|---|---|
| [`deployment.md`](deployment.md) | `site/`, `scripts/check_public_bundle.py`, `.github/workflows/deploy-pages.yml`, `README.md`, `AGENTS.md` | Public-artifact boundary, Pages deployment, canonical URL, and verification | Changing the mirrored site, deployment workflow, repository contents, or public-data checks |

## Maintenance

- Keep specs compact, evidence-based, and current.
- Update this map when a spec is added, moved, split, or removed.
- Keep plans, TODOs, work logs, and merge handoffs outside `specs/`.
- Label planned behavior and open decisions; do not present them as implemented facts.
