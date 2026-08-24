# Employee portal — Firebase setup (Stage 1)

This adds an **employee login** so staff can submit their own hours/PTO, and an **admin
approval** step. Data lives in **Firebase** (project `payroll-a5d44`), not in `data.json`.

Files in this repo:
- `index.html` — **the main admin tracker, now Firebase-backed.** Requires admin login, loads and
  saves live to Firebase (no more data.json download), and shows employee submissions with an
  **Approve** button right in the month view.
- `employee.html` — the employee app (login → timesheet → their time-off dashboard).
- `admin.html` — a lightweight companion used **once** to import your existing data.json into
  Firebase; it also has a plain approvals list. After setup you mostly live in `index.html`.
- `db.js` — Firebase connection (your public config).
- `core.js` — shared calculation engine for the employee/admin apps.
- `firestore.rules` — the security rules (you paste these into Firebase).

Everything is served from GitHub Pages, same as now. Admin tracker: `https://<your-pages-url>/`
(index.html). Employee page: `.../employee.html`.

---

## One-time setup (do these in order)

### 1. Publish the security rules
Firebase Console → **Firestore Database → Rules** tab → delete what's there, paste the entire
contents of `firestore.rules`, click **Publish**. These rules make the admin (you) all-powerful
and lock each employee to only their own data.

### 2. Create the login accounts
Firebase Console → **Authentication → Users → Add user**. Create one account per person:
- **You (admin):** email `admin@brickellmg.com` + a password. This exact email is what the rules
  and the admin page recognize as the administrator — keep it as-is.
- **Jorge (and any employee):** an email + a temporary password you give them.
  - If an employee has no email, you can use a login-only handle like `jorge@brickellmg.com` —
    it just has to be in email format and match what you enter in Step 4.

### 3. Commit & push these files
Commit `db.js`, `core.js`, `employee.html`, `admin.html` (and `firestore.rules`,
`FIREBASE-SETUP.md` for reference) and push, so GitHub Pages serves them.

### 4. Import your current data into Firebase (once)
Open **`admin.html` on your live GitHub Pages URL** (not a double-clicked file). Sign in as
`admin@brickellmg.com`. Under **Setup**, click **Load data.json** → for each employee, type the
**exact login email** you created in Step 2 → **Import to Firestore**. This copies your company
settings, holidays, employees, entitlements, and prior-used into the database.

> The email you enter here is the link between a person's login and their timesheet. It must match
> their Authentication account email exactly.

---

## The everyday flow

1. **Employee** opens `employee.html`, signs in, and sees the current month **pre-filled at 8
   hours/day**. They only change what's different — a sick day, vacation, overtime, or actual
   hours if they worked less. They click **Submit for approval**. They can also see their own
   **vacation / sick / personal remaining** at the bottom.
2. **You** open the **main tracker (index.html)** and sign in as admin. Submitted months show a
   **Submitted** badge with an **Approve** button in the Status column (a banner up top tells you
   how many are waiting). Click **Approve** — it locks on the employee's side and the numbers are
   already in your payroll totals. From the tracker you can also **Reject** by editing, or just
   adjust anything yourself. (The simple list in `admin.html` can also approve, if you prefer.)
3. Everything saves to Firebase automatically — the little **Saved to cloud** chip confirms it.
   Approved numbers are what you submit to payroll on the 26th.

Employees can only ever see and edit **their own** months, and only until you approve — they can't
see anyone else's data or approve their own.

---

## Notes & what's next

- **Your config keys are public on purpose.** Firebase web apps expose them; your data is protected
  by the rules + logins, not by hiding the keys.
- **No more data.json downloading.** The tracker now saves live to Firebase. `data.json` stays in
  the repo only as the seed the one-time import reads; you don't edit or commit it anymore.
- **Adding a new employee later:** in the tracker, **Employees → Add employee**, fill in their
  details **and their login email**, Save. Then create their Auth account (Step 2) with that same
  email. That's it — no console data entry, no re-import.
- **Which pages to bookmark:** you → the tracker (`index.html`); each employee → `employee.html`.
