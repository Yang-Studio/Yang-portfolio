from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from tempfile import NamedTemporaryFile

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FILM_SITE = ROOT / "project-sources" / "photography" / "film-archive" / "site"


def convert_image(source: Path, max_edge: int, quality: int) -> tuple[Path, Path, int, int]:
    target = source.with_suffix(".webp")
    old_size = source.stat().st_size

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        width, height = image.size
        scale = min(1.0, max_edge / max(width, height))
        if scale < 1.0:
            image = image.resize(
                (max(1, round(width * scale)), max(1, round(height * scale))),
                Image.Resampling.LANCZOS,
            )

        with NamedTemporaryFile(
            dir=target.parent,
            prefix=f"{target.stem}.",
            suffix=".tmp.webp",
            delete=False,
        ) as temporary:
            temporary_path = Path(temporary.name)

        try:
            image.save(
                temporary_path,
                "WEBP",
                quality=quality,
                method=6,
                optimize=True,
            )
            temporary_path.replace(target)
        finally:
            temporary_path.unlink(missing_ok=True)

    new_size = target.stat().st_size
    source.unlink()
    return source, target, old_size, new_size


def replace_text(path: Path, replacements: dict[str, str]) -> None:
    text = path.read_text(encoding="utf-8")
    updated = text
    for old, new in replacements.items():
        updated = updated.replace(old, new)
    if updated != text:
        path.write_text(updated, encoding="utf-8")


def optimize_film() -> list[tuple[Path, Path, int, int]]:
    tasks: list[tuple[Path, int, int]] = []
    photo_dir = PUBLIC / "embedded-sites" / "film" / "media" / "photos"
    thumb_dir = PUBLIC / "embedded-sites" / "film" / "media" / "thumbs"

    tasks.extend((path, 1800, 80) for path in photo_dir.glob("*.jpg"))
    tasks.extend((path, 480, 70) for path in thumb_dir.glob("*.jpg"))

    with ThreadPoolExecutor(max_workers=6) as executor:
        results = list(executor.map(lambda item: convert_image(*item), tasks))

    replace_text(
        FILM_SITE / "data.js",
        {
            "media/photos/img-": "media/photos/img-",
            '.jpg"': '.webp"',
        },
    )
    return results


def optimize_project_assets() -> list[tuple[Path, Path, int, int]]:
    project_root = PUBLIC / "assets" / "projects"
    sources = sorted(
        path
        for path in project_root.rglob("*")
        if path.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )
    results: list[tuple[Path, Path, int, int]] = []

    for source in sources:
        with Image.open(source) as image:
            width, height = image.size
        max_edge = 3200 if max(width, height) / max(1, min(width, height)) > 2.4 else 2400
        results.append(convert_image(source, max_edge=max_edge, quality=84))

    replacements: dict[str, str] = {}
    for source, target, _, _ in results:
        old_url = "/" + source.relative_to(PUBLIC).as_posix()
        new_url = "/" + target.relative_to(PUBLIC).as_posix()
        replacements[old_url] = new_url

    for path in (ROOT / "src").rglob("*"):
        if path.suffix in {".ts", ".tsx"}:
            replace_text(path, replacements)

    return results


def summarize(label: str, results: list[tuple[Path, Path, int, int]]) -> None:
    old_size = sum(item[2] for item in results)
    new_size = sum(item[3] for item in results)
    saved = old_size - new_size
    ratio = (new_size / old_size * 100) if old_size else 100
    print(
        f"{label}: {len(results)} files, "
        f"{old_size / 1024 / 1024:.2f} MB -> {new_size / 1024 / 1024:.2f} MB "
        f"({ratio:.1f}%, saved {saved / 1024 / 1024:.2f} MB)"
    )


def main() -> None:
    film_results = optimize_film()
    project_results = optimize_project_assets()
    summarize("Film Archive", film_results)
    summarize("Project assets", project_results)


if __name__ == "__main__":
    main()
