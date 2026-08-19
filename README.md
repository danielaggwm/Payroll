# Brickell Payroll & PTO Tracker

A single-page tool to track hours, holidays, overtime, PTO, and mileage for your team,
and to see exactly what to submit to the payroll company each month. Two files, no server,
no database, free to host on GitHub Pages.

## What's in this folder

- **index.html** — the whole app (HTML + CSS + JavaScript in one file).
- **data.json** — your data: company settings, employees, PTO allowances, and monthly entries.

## How it works

- **Holidays and working days calculate themselves for any year.** The paid holidays
  (New Year's, Good Friday, Memorial Day, July 4, Labor Day, Thanksgiving + the Friday after,
  Christmas) are computed by rule — Memorial Day is always the last Monday of May, Good Friday
  comes from Easter, etc. A holiday that lands on a weekend is not counted, just like your old
  sheet. **Nothing needs updating when 2027 arrives** — pick the new year and it's already correct.
- **Working days** = weekdays in the month − paid holidays that fall on a weekday.
- **Hourly** (e.g. Jorge): Regular hours = working days × hours/day − time off. Total pay hours =
  Regular + Holiday + Overtime + Adjustment + paid time off.
- **Salaried** (e.g. Daniela): salary hours = working days × hours/day. Time off is tracked for
  the balance but doesn't change pay.
- **The "Adj" column** is for the 26th-payroll-cutoff reconciliation: when you run a month's
  payroll, verify the previous month's leftover days (after the 26th) and enter a **negative**
  number to deduct any hours someone was short. Salaried staff don't use it.
- **PTO is entered in days** (0.5 for a half day). Overtime and Adjustment are in hours.
- Tracking starts **August 2026** — months before that don't count toward totals. Change this
  anytime via `trackingStart` in data.json.

## Daily use

1. Open the app, pick the **month** and **year**.
2. In **Month view**, type each person's OT, Vacation/Sick/Personal (days), Miles, and any Adj.
   Grey columns fill in automatically.
3. Use **"What to submit to payroll"** (Copy summary button) to paste hours into your provider.
4. Click each person's tab for their **dashboard**: hours, overtime, mileage, and PTO
   used-vs-remaining meters.
5. Add or remove people anytime with the **Employees** button (set hourly/salaried, hours/day,
   and each person's vacation/sick/personal allowance, plus anything already used this year).

## Saving your data (important)

The app auto-saves to your browser as you work, so you never lose an entry. To keep the
**shared, permanent copy in GitHub**:

1. Click **↓ data.json** (top right) to download the updated file.
2. Replace `data.json` in your repository with the downloaded one and commit it.

That's your version history and backup. On another computer, the app loads whatever `data.json`
is in the repo. (The **Import** button lets you load a data.json by hand if needed.)

## Hosting it free on GitHub Pages

1. Create a new repository (e.g. `payroll`) on GitHub.
2. Upload **index.html** and **data.json** to it.
3. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick
   `main` and `/root`, save.
4. After a minute your tool is live at `https://<your-username>.github.io/payroll/`.
5. Bookmark it. To make the repo private but still usable, keep it private and just open the
   file locally, or use a private Pages option — ask if you want help with that.

> Tip: opening `index.html` by double-clicking works too, but browsers block reading `data.json`
> from a double-clicked file, so the app falls back to its built-in starting data. Hosting on
> GitHub Pages (or any web server) is what makes `data.json` load. Your browser copy still saves
> either way.
