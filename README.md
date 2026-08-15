# Shri Syam Builder & Property — Website

A mobile-responsive HTML/CSS/JS website for a Dehradun property dealer, with a JSON-driven admin panel. No build step, no backend — built to run directly on GitHub Pages.

## Folder structure

```
index.html          → public website
admin.html           → admin panel (edit content, view leads)
css/style.css         → site styles
css/admin.css         → admin panel styles
js/main.js            → renders the site from data/content.json
js/admin.js            → admin panel logic
data/content.json       → ALL editable content (site name, contact info, properties, etc.)
```

## 1. Hosting on GitHub Pages

1. Create a new GitHub repository (e.g. `shri-syam-builder`).
2. Upload all files in this folder, keeping the same structure.
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/root`.
5. Save — your site will be live at `https://<your-username>.github.io/shri-syam-builder/` within a minute or two.

## 2. Using the Admin Panel

Open `yoursite.com/admin.html`.

- **Default password:** `syam@2026` — change this immediately from Settings → "Change Admin Password".
- **Site Settings** — business name, tagline, phone, WhatsApp number, email, address, social links, homepage stats.
- **Properties** — add, edit, delete plot/flat/home listings.
- **Inquiries** — view leads submitted through the Contact Us form.
- **Publish** — download the updated `content.json` and upload it to GitHub to make changes live.

### Important: how "publishing" works

GitHub Pages only serves static files — there's no server to save your edits automatically. So the admin panel works like this:

1. You edit Settings/Properties in the admin panel (changes are kept in your browser for that session).
2. Go to the **Publish** tab and click **Download content.json**.
3. Upload that file to your GitHub repo, replacing `data/content.json` (edit in place on github.com, or use "Upload files").
4. Commit — the live site updates for everyone within a minute or two.

This means only the site owner (whoever has GitHub access) can actually make edits live — which is exactly what you want for security, since there's no login server involved.

## 3. Lead capture (Contact Us form)

Because GitHub Pages has no backend, form submissions are handled three ways at once so nothing gets lost:

1. **Local demo log** — every submission is saved to the visitor's own browser (`localStorage`), visible in Admin → Inquiries on that same device. Good for testing, not for real cross-device leads.
2. **Instant WhatsApp handoff** — after submitting, the visitor sees a "Tap here to also send it on WhatsApp" link that opens a pre-filled WhatsApp message to your number. This is the most reliable channel — recommend telling customers to always tap it.
3. **Google Sheet webhook (recommended for real lead capture)** — a few minutes of one-time setup gets every enquiry, from any visitor's device, landing in a Google Sheet you can check anytime, and shown automatically in Admin → Inquiries.

### Setting up the Google Sheet webhook

1. Create a Google Sheet. Name a tab `Leads` with header row: `date, name, phone, interest, message`.
2. In the Sheet: **Extensions → Apps Script**, replace the code with:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([data.date, data.name, data.phone, data.interest, data.message]);
     return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app.** Set "Who has access" to **Anyone**. Deploy and copy the Web App URL.
4. In `data/content.json`, set `"leadsWebhookUrl"` to that URL.
5. To show these leads inside the admin panel too: **File → Share → Publish to web**, choose the `Leads` tab, format **CSV**, publish, and copy that link into `"leadsSheetCsvUrl"` in `content.json`.
6. Commit `content.json` to GitHub. New enquiries now land in your Sheet and show in Admin → Inquiries.

## 4. Customizing

- **Property images:** paste any public image URL into a property's "Image URL" field in the admin panel. Leave blank for a plain color card.
- **Map:** the Contact section map follows `mapQuery` in `content.json` (defaults to "Dehradun, Uttarakhand") — set it to a more specific address for a tighter map pin.
- **Colors/fonts:** all design tokens are at the top of `css/style.css` under `:root` if a developer wants to adjust the palette later.

## Notes on security

The admin password is checked entirely in the browser (there's no server on GitHub Pages to check it securely). This keeps casual visitors out of the editing screen, but anyone with real technical know-how could view the password in `content.json`. For a small business site like this it's a reasonable trade-off, but don't use it to gate anything sensitive.
