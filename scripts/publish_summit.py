#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import shutil
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SUMMIT = ROOT / "summit"
QUEUE = SUMMIT / "publish-queue.json"
LIVE = SUMMIT / "articles"
SCHEDULED = SUMMIT / "scheduled"
ARTICLES = SUMMIT / "articles.json"
SITEMAP = ROOT / "sitemap.xml"
TZ = ZoneInfo("America/Phoenix")

def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))

def main():
    now = datetime.now(TZ)
    queue = load_json(QUEUE)
    due, future = [], []

    for item in queue:
        when = datetime.fromisoformat(
            item["publish_date"] + "T" + item.get("publish_time", "05:00")
        ).replace(tzinfo=ZoneInfo(item.get("timezone", "America/Phoenix")))
        (due if now >= when else future).append(item)

    if not due:
        print("No scheduled Summit articles are due.")
        return

    current = load_json(ARTICLES)
    known = {x.get("slug") for x in current}

    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns)
    tree = ET.parse(SITEMAP)
    xml_root = tree.getroot()
    urls = {e.text for e in xml_root.findall(f".//{{{ns}}}loc")}

    published = []
    unresolved = []

    for item in sorted(due, key=lambda x: (x["publish_date"], x.get("publish_time", "05:00"))):
        slug = item["slug"]
        src = SCHEDULED / f"{slug}.html"
        dst = LIVE / f"{slug}.html"

        if not src.exists() and dst.exists():
            # Already published, so remove it from the queue safely.
            published.append(slug + " (already live)")
        elif not src.exists():
            print(f"ERROR: scheduled source missing for {slug}")
            unresolved.append(item)
            continue
        else:
            shutil.copy2(src, dst)
            src.unlink()
            published.append(slug)

        if slug not in known:
            current.insert(0, {k: item[k] for k in ("slug","title","category","read","description")})
            known.add(slug)

        url = f"https://summerpeaks.com/summit/articles/{slug}.html"
        if url not in urls:
            node = ET.SubElement(xml_root, f"{{{ns}}}url")
            loc = ET.SubElement(node, f"{{{ns}}}loc")
            loc.text = url
            lastmod = ET.SubElement(node, f"{{{ns}}}lastmod")
            lastmod.text = item["publish_date"]
            urls.add(url)

    for i, item in enumerate(current, 1):
        item["num"] = f"{len(current)-i+1:02d}"

    ARTICLES.write_text(json.dumps(current, indent=2), encoding="utf-8")
    QUEUE.write_text(json.dumps(future + unresolved, indent=2), encoding="utf-8")
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)

    print("Published:", ", ".join(published) if published else "none")
    if unresolved:
        print("Unresolved:", ", ".join(x["slug"] for x in unresolved))

if __name__ == "__main__":
    main()
