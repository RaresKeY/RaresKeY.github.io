#!/usr/bin/env python3
"""Validate the exact public artifact published by GitHub Pages."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
MAX_BUNDLE_BYTES = 10 * 1024 * 1024
CANONICAL_URL = "https://rareskey.web.app/"
PUBLIC_EMAILS = {"smallloopworks@proton.me"}

EXPECTED_FILES = {
    ".nojekyll",
    "Rares-P-CV.pdf",
    "assets/apple-touch-icon.png",
    "assets/favicon-16x16.png",
    "assets/favicon-32x32.png",
    "assets/favicon-mug.png",
    "assets/favicon.ico",
    "assets/games/spill-the-divine.png",
    "assets/games/supper-guard.png",
    "assets/games/white-approach.png",
    "assets/games/black-seed-directive.png",
    "assets/games/charge-grid.png",
    "assets/games/charge-knights.png",
    "assets/games/code-review-simulator.png",
    "assets/games/horizon-charge.png",
    "assets/games/incremental-framework.png",
    "assets/games/plug-prosper.png",
    "assets/games/the-hollow-signal.png",
    "assets/fonts/OFL.txt",
    "assets/fonts/open-sans-bold.woff",
    "assets/fonts/open-sans-extrabold.woff",
    "assets/fonts/open-sans-regular.woff",
    "assets/fonts/open-sans-semibold.woff",
    "assets/operator-profile.png",
    "assets/operator-splash.png",
    "assets/social-preview.png",
    "assets/why-33-flag.png",
    "assets/certificates/micro-jam-064.webp",
    "cv.css",
    "cv.html",
    "games.html",
    "index.html",
    "script.js",
    "static-cv.md",
    "styles.css",
}

ALLOWED_EXTERNAL_IFRAMES = {
    ("itch.io", "/embed/5062726"),
    ("itch.io", "/embed/5056129"),
    ("itch.io", "/embed/4976010"),
    ("itch.io", "/embed/4858054"),
    ("itch.io", "/embed/4852602"),
    ("itch.io", "/embed/4852614"),
    ("itch.io", "/embed/4852654"),
    ("itch.io", "/embed/4852636"),
    ("itch.io", "/embed/4846145"),
    ("itch.io", "/embed/4621067"),
    ("itch.io", "/embed/4594815"),
}
ALLOWED_GAME_FRAME_SOURCES = {
    ("itch.io", "/embed-upload/19431982"),
    ("itch.io", "/embed-upload/19415598"),
    ("itch.io", "/embed-upload/19113756"),
    ("itch.io", "/embed-upload/18654676"),
    ("itch.io", "/embed-upload/18638138"),
    ("itch.io", "/embed-upload/18634933"),
    ("itch.io", "/embed-upload/18635127"),
    ("itch.io", "/embed-upload/18634180"),
    ("itch.io", "/embed-upload/18607354"),
    ("itch.io", "/embed-upload/17612233"),
}

TEXT_SUFFIXES = {".css", ".html", ".js", ".md", ".txt"}
EMAIL_PATTERN = re.compile(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
)
CREDENTIAL_PATTERNS = {
    "AWS access key": re.compile(rb"(?:AKIA|ASIA)[0-9A-Z]{16}"),
    "Firebase API key": re.compile(rb"AIza[0-9A-Za-z_-]{30,}"),
    "GitHub token": re.compile(
        rb"(?:github_pat_[0-9A-Za-z_]{20,}|gh[pousr]_[0-9A-Za-z]{20,})"
    ),
    "OpenAI-style key": re.compile(rb"sk-[A-Za-z0-9_-]{20,}"),
    "private key": re.compile(
        rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"
    ),
    "credential URL": re.compile(rb"https?://[^/@\s]+:[^/@\s]+@"),
}
PRIVATE_CONTEXT_PATTERNS = {
    "local filesystem path": re.compile(rb"(?:/home|/Users)/[^/\s]+/"),
    "private tailnet hostname": re.compile(rb"[a-z0-9-]+\.ts\.net"),
}


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical_links: list[str] = []
        self.local_references: list[str] = []
        self.external_runtime_assets: list[tuple[str, str]] = []
        self.game_frame_sources: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        values = dict(attrs)
        game_frame_source = values.get("data-game-src")
        if game_frame_source:
            self.game_frame_sources.append(game_frame_source)
        if tag == "link" and "canonical" in (values.get("rel") or "").split():
            href = values.get("href")
            if href:
                self.canonical_links.append(href)

        for attribute in ("href", "src"):
            reference = values.get(attribute)
            if not reference or reference.startswith(("#", "data:")):
                continue
            parsed = urlparse(reference)
            if parsed.scheme in {"http", "https", "mailto"}:
                if attribute == "src":
                    self.external_runtime_assets.append((tag, reference))
                continue
            self.local_references.append(reference)


def relative_files() -> set[str]:
    return {
        path.relative_to(SITE).as_posix()
        for path in SITE.rglob("*")
        if path.is_file()
    }


def validate_html(path: Path) -> list[str]:
    parser = SiteParser()
    parser.feed(path.read_text(encoding="utf-8"))
    failures: list[str] = []
    for tag, reference in parser.external_runtime_assets:
        parsed = urlparse(reference)
        if (
            path.name == "games.html"
            and tag == "iframe"
            and parsed.scheme == "https"
            and (parsed.hostname, parsed.path) in ALLOWED_EXTERNAL_IFRAMES
        ):
            continue
        failures.append(
            f"{path.name}: external runtime asset is not allowed: {reference}"
        )

    for reference in parser.game_frame_sources:
        parsed = urlparse(reference)
        if (
            path.name != "games.html"
            or parsed.scheme != "https"
            or (parsed.hostname, parsed.path) not in ALLOWED_GAME_FRAME_SOURCES
        ):
            failures.append(
                f"{path.name}: game frame source is not allowed: {reference}"
            )

    for reference in parser.local_references:
        clean_reference = reference.split("#", 1)[0].split("?", 1)[0]
        target = (path.parent / clean_reference).resolve()
        if not target.is_relative_to(SITE):
            failures.append(f"{path.name}: reference escapes site/: {reference}")
        elif not target.is_file():
            failures.append(f"{path.name}: missing local target: {reference}")

    if path.name == "index.html" and parser.canonical_links != [CANONICAL_URL]:
        failures.append(
            f"index.html: expected canonical {CANONICAL_URL!r}, "
            f"found {parser.canonical_links!r}"
        )

    return failures


def main() -> int:
    failures: list[str] = []
    if not SITE.is_dir():
        print("Public bundle check failed: missing site/")
        return 1

    symlinks = [
        path.relative_to(ROOT).as_posix()
        for path in SITE.rglob("*")
        if path.is_symlink()
    ]
    failures.extend(f"symlink is not allowed: {path}" for path in symlinks)

    actual_files = relative_files()
    for path in sorted(EXPECTED_FILES - actual_files):
        failures.append(f"missing expected public file: {path}")
    for path in sorted(actual_files - EXPECTED_FILES):
        failures.append(f"unexpected public file: {path}")

    bundle_size = sum(
        path.stat().st_size for path in SITE.rglob("*") if path.is_file()
    )
    if bundle_size > MAX_BUNDLE_BYTES:
        failures.append(
            f"bundle is {bundle_size} bytes; limit is {MAX_BUNDLE_BYTES}"
        )

    public_emails: set[str] = set()
    for relative_path in sorted(actual_files):
        path = SITE / relative_path
        data = path.read_bytes()
        for label, pattern in CREDENTIAL_PATTERNS.items():
            if pattern.search(data):
                failures.append(f"{relative_path}: contains {label} signature")
        for label, pattern in PRIVATE_CONTEXT_PATTERNS.items():
            if pattern.search(data):
                failures.append(f"{relative_path}: contains {label}")

        if path.suffix.lower() in TEXT_SUFFIXES:
            text = data.decode("utf-8")
            public_emails.update(EMAIL_PATTERN.findall(text))

    if public_emails != PUBLIC_EMAILS:
        failures.append(
            f"expected public email set {sorted(PUBLIC_EMAILS)!r}, "
            f"found {sorted(public_emails)!r}"
        )

    for html_name in ("index.html", "games.html", "cv.html"):
        path = SITE / html_name
        if path.is_file():
            failures.extend(validate_html(path))

    if failures:
        print("Public bundle check failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Public bundle check passed.")
    print(f"- Files: {len(actual_files)}")
    print(f"- Size: {bundle_size} bytes")
    print("- Symlinks: 0")
    print("- External runtime assets: only allowlisted itch.io listings on games.html")
    print("- Local references: resolved")
    print("- Credential and private-context signatures: 0")
    print(f"- Canonical URL: {CANONICAL_URL}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
