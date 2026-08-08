# Summer Peaks Bookkeeping & Accounting Website

A lightweight, premium static website built for Cloudflare Pages.

## Included

- Responsive one-page Summer Peaks website
- Premium navy / brushed-gold / ivory design
- Professional Liability Insured and Cyber Protected trust messaging
- Step 1: Full Free Bookkeeping Assessment
- Assessment automatically emailed to Jay
- Step 2: Scheduling calendar revealed immediately after successful submission
- Cloudflare Pages Function for secure form handling
- No database required
- No framework or build step required

## 1. Set your scheduling calendar

Open:

`assets/config.js`

Replace:

`REPLACE-ME-WITH-YOUR-PUBLIC-BOOKING-LINK`

with your public scheduling page URL.

Recommended choices:
- Google Calendar Appointment Schedules
- Calendly
- Microsoft Bookings

Use a public/embeddable booking page URL, not a private Google Calendar URL.

## 2. Email setup (assessment -> Jay)

The form uses Resend through a Cloudflare Pages Function. This keeps the API key out of the browser.

Create a Resend account and verify a sending domain/address. Then in Cloudflare Pages add these environment variables:

- `RESEND_API_KEY` = your Resend API key
- `FROM_EMAIL` = a verified sender, e.g. `Summer Peaks <forms@summerpeaks.com>`
- `TO_EMAIL` = `jay@summerpeaks.com`

Do NOT put the API key in `config.js`.

## 3. GitHub upload

Create a new GitHub repository, for example:

`summer-peaks-website`

Upload the CONTENTS of this folder so `index.html` is at the repository root.

The repository should look like:

```
index.html
styles.css
script.js
assets/
  config.js
  logo.png
  favicon.png
functions/
  api/
    assessment.js
README.md
```

## 4. Deploy on Cloudflare Pages

In Cloudflare:

1. Go to **Workers & Pages**.
2. Choose **Create application**.
3. Choose **Pages** / **Import an existing Git repository** (wording may vary).
4. Connect GitHub.
5. Select the `summer-peaks-website` repository.
6. Production branch: `main`.
7. This site has no build step.
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/` or leave at the static-site default Cloudflare shows.
8. Deploy.

Then add the environment variables listed in step 2 and redeploy.

## 5. Connect summerpeaks.com

In the Cloudflare Pages project, open **Custom domains** and add:

`summerpeaks.com`

You can also add:

`www.summerpeaks.com`

If the domain's DNS is already managed by Cloudflare, it will guide you through the DNS record automatically.

## 6. Test before launch

Submit your own assessment and confirm:

1. Required fields work.
2. The assessment arrives at `jay@summerpeaks.com`.
3. Reply-To is the prospect's email.
4. The scheduling page appears immediately.
5. A test appointment can be booked.
6. Mobile layout looks correct.

## Editing text

Most website copy is directly in `index.html`.

Colors and visual styling are in `styles.css`.

Calendar link is in `assets/config.js`.

## Important insurance wording

The live site currently says:
- Professional Liability Insured
- Cyber Protected

Only publish those claims while the applicable policies are active.
