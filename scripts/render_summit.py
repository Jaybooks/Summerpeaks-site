#!/usr/bin/env python3
"""Render crawlable Summit cards from the existing article catalogue."""
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
START = '<!-- SUMMIT CARDS START -->'
END = '<!-- SUMMIT CARDS END -->'


def render_library():
    items = json.loads((ROOT / 'summit/articles.json').read_text(encoding='utf-8'))
    cards = []
    for item in items:
        slug = item['slug']
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
            raise ValueError(f'Invalid article slug: {slug}')
        if not (ROOT / 'summit/articles' / f'{slug}.html').is_file():
            raise ValueError(f'Missing article: {slug}')
        a = {k: escape(str(item[k]), quote=True) for k in
             ('num', 'category', 'title', 'description', 'read')}
        cards.append(f'<a class="article-card" href="articles/{slug}.html">'
                     f'<span class="num">{a["num"]}</span><div>'
                     f'<span class="kicker">{a["category"]}</span>'
                     f'<h2>{a["title"]}</h2><p>{a["description"]}</p></div>'
                     f'<span class="meta">{a["read"]} read →</span></a>')
    path = ROOT / 'summit/index.html'
    source = path.read_text(encoding='utf-8')
    if source.count(START) != 1 or source.count(END) != 1:
        raise ValueError('Expected exactly one Summit card region')
    before, rest = source.split(START)
    _, after = rest.split(END)
    path.write_text(before + START + '\n' + '\n'.join(cards) + '\n' + END + after,
                    encoding='utf-8')


if __name__ == '__main__':
    render_library()
