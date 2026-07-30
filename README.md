# Rares P. Portfolio

Public deployment mirror for the Rares P. portfolio.

- GitHub Pages: <https://rareskey.github.io/>
- Canonical site: <https://rareskey.web.app/>

The reviewed static artifact lives in `site/`. The authoring source and private
working material are maintained separately and are not part of this repository
or its history.

Pushes to `main` validate the exact public bundle and deploy only `site/`
through GitHub Pages.

## Verify

```bash
python scripts/check_public_bundle.py
deno check site/script.js
```

The bundle checker enforces the exact public file set, rejects symlinks and
common credential signatures, resolves local HTML references, and confirms the
intended canonical URL and public contact address.
