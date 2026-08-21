THE SUMMIT — ADDING A NEW ARTICLE

The system is intentionally simple for GitHub Pages.

STEP 1
Duplicate:
  /summit/ARTICLE_TEMPLATE.html
into:
  /summit/articles/

Rename it with a short descriptive slug, for example:
  cash-flow-forecasting.html

STEP 2
Edit the copied article.
Replace:
  ARTICLE TITLE
  ARTICLE META DESCRIPTION
  ARTICLE-SLUG
  CATEGORY
  READ TIME
  ARTICLE COPY

Choose ONE article theme on the <body> tag so new pages do not all look the same:
  theme-workflow
  theme-editorial
  theme-numbered
  theme-playbook
  theme-dashboard
  theme-system

STEP 3
Open /summit/articles.json and add ONE new entry.
Copy the format of an existing article and change:
  num
  slug
  title
  category
  read
  description

The Summit landing page reads this file automatically. No HTML card needs to be created.

STEP 4
Add the final article URL to /sitemap.xml so search engines can discover it quickly.

IMPORTANT
- Keep article URLs descriptive.
- Give every article a unique title, meta description, article angle, and layout/theme.
- Write for a real business-owner search question, not generic filler.
- Keep Summer Peaks branding and the Get a Free Quote CTA.
- Do not mention QuickBooks publicly.
- The hidden homepage #assessment anchor remains unchanged so existing links keep working.

NEW REQUIRED TOP CTA
Every Summit article must include the top service CTA immediately below the article header.
Change:
  ARTICLE SERVICE
  ARTICLE-SPECIFIC SERVICE DESCRIPTION
so it directly matches the subject of that individual article.
The button must remain linked to /#assessment (the public-facing button says Get a Free Quote).
