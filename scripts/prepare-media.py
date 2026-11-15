"""Copy reviewed media from the sibling project repos into public/media.

Product and game screenshots (radar, brio, idle, arena, mesa, docker-manager)
are not copied by this script: they were captured from the running apps with
fictional data (APIs answered by mocks, or throwaway databases) and reviewed
image by image before being committed.

Every image is re-encoded (drops EXIF and other metadata), optionally cropped
and downscaled. Run with: python3 -I scripts/prepare-media.py
The source repos are expected next to this one (override with REPOS=/path).
"""

import os
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REPOS = Path(os.environ.get("REPOS", ROOT.parent))
OUT = ROOT / "public" / "media"

# (source relative to REPOS, output relative to public/media, options)
# crop = fraction trimmed from (right, bottom); some generated backgrounds carry
# a corner mark that must not be published.
JOBS = [
    # Forja Hub: landing screenshots, demo data marked as fictional
    ("forge/forge-landing/public/prints/construtor-modulos.webp", "forja/construtor-modulos.webp", {}),
    ("forge/forge-landing/public/prints/construtor-aparencia.webp", "forja/construtor-aparencia.webp", {}),
    ("forge/forge-landing/public/prints/plataforma-agenda.webp", "forja/plataforma-agenda.webp", {}),
    # Character sheet portrait: Idle Legends warrior, owner-generated art
    ("project-idle-legends/client/src/assets/heroes/warrior.png", "idle/guerreiro.png", {"max": 256}),
]


def process(src: Path, dst: Path, opts: dict) -> None:
    im = Image.open(src)
    im.load()
    im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
    if "crop" in opts:
        fr, fb = opts["crop"]
        im = im.crop((0, 0, round(im.width * (1 - fr)), round(im.height * (1 - fb))))
    limit = opts.get("max", 1600)
    if max(im.size) > limit:
        ratio = limit / max(im.size)
        im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.Resampling.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.suffix == ".webp":
        im.save(dst, "WEBP", quality=82, method=6)
    else:
        im.save(dst, "PNG", optimize=True)


def main() -> int:
    missing = 0
    for rel_src, rel_dst, opts in JOBS:
        src = REPOS / rel_src
        if not src.exists():
            print(f"missing: {rel_src}", file=sys.stderr)
            missing += 1
            continue
        process(src, OUT / rel_dst, opts)
        print(f"ok  {rel_dst}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
