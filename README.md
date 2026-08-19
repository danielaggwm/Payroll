# Brickell Management One Corp — Payroll & PTO Tracker

A single-page web app to track hours, holidays, overtime, PTO, and mileage for the team,
and to see exactly what to submit to the payroll company each month. Two files, no server,
free to host on GitHub Pages.

## Files

- **index.html** — the whole app (HTML + CSS + JavaScript, plus the logo, in one file).
- **data.json** — your data: company settings, employees, PTO allowances, and monthly entries.

## How the numbers work

- **The calendar builds itself for any year.** Paid company holidays (New Year's, Good Friday,
  Memorial Day, July 4, Labor Day, Thanksgiving + the Friday after, Christmas) are computed by
  rule — Memorial Day is the last Monday of May, Good Friday comes from Easter, etc. A holiday
  that lands on a weekend isn't counted. **Nothing needs updating when 2027 arrives** — pick the
  new year and it's already correct.
- **Working days** = weekdays in the month − paid holidays that fall on a weekday.
- **Hourly** (e.g. Jorge): Regular hours = working days × hours/day − time off. You can also type
  the **actual hours worked** straight into the Reg/Sal cell to override the auto value (it turns
  blue when overridden; clear it to snap back). Total = Regular + Holiday + OT + Adjustment + PTO.
- **Salaried** (e.g. Daniela): salary hours = working days × hours/day. Time off is tracked for
  the balance but doesn't change pay.
- **The "Adj" column** handles the 26th-payroll-cutoff reconciliation: when you run a month's
  payroll, verify the previous month's leftover days (after the 26th) and enter a **negative**
  number to deduct any hours someone was short. Salaried staff don't use it.
- **Tracking starts August 2026** — months before that don't count toward totals. Change this via
  `trackingStart` in data.json.

## Using it each month

1. Open the app, pick the **month** and **year**.
2. In **Month view**, type each person's OT, Vacation/Sick/Personal, Miles, and any Adj. Grey
   columns fill in automatically. Use the **Days / Hours** toggle (top right) to enter time off
   however it was taken — a full day, or a partial like 5.5 hours.
3. Use **"What to submit to payroll"** (Copy summary) to paste hours into your provider.
4. Each person's tab shows their **dashboard**: hours, overtime, mileage, and PTO
   used-vs-remaining meters (with its own Days/Hours toggle).
5. **Employees** button (top): add or remove people, set hourly/salaried, hours/day, PTO
   allowances, and anything already used before tracking began.
6. Export any employee's year as **CSV** from their dashboard, or all of them from Year summary.

## Saving your data

The app auto-saves to your browser as you work, so you never lose an entry. The header chip shows
**"Unsaved changes"** (amber) when your browser has edits that aren't in `data.json` yet, and
**"Saved"** (green) when they match.

To write those edits to `data.json`:

- **Chrome / Edge:** the button reads **"Link data.json"** the first time — click it, select this
  `data.json`, and allow edit access. After that it says **"Save data.json"** and overwrites the
  file directly with one click (right-click the button to re-link a different file). Use the
  **hosted GitHub Pages URL**, not a double-clicked local file, for this to work.
- **Other browsers:** the button downloads `data.json`; replace the file in this folder.

Either way, **commit and push** the updated `data.json` for the live site (and other devices) to
pick it up. Direct-save writes your local file; git publishes it.

## Hosting on GitHub Pages

1. This folder is the repo. Commit **index.html** and **data.json**.
2. Repo **Settings → Pages → Deploy from a branch**, pick the branch and `/root`, save.
3. Your tool is live at `https://<your-username>.github.io/<repo>/`. Bookmark it and use that URL.

## Note on the employee side

Employee logins and clock-in/out (the uAttend replacement) can't run on a static GitHub Pages
site by itself — that needs a hosted database + authentication (e.g. Supabase or Firebase, or an
off-the-shelf time clock). That's the one feature that requires stepping beyond this two-file
setup; it's a separate decision when you're ready.
