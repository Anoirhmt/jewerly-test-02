# CLAUDE.md — Elarain Project Full Context

Read this entire file before doing anything. It contains everything about this project.

---

## 1. WHO IS THE USER

- Name: **Anoir**
- Business: **Elarain Jewelry** — sells Moroccan jewelry (bijoux marocains)
- WhatsApp bot: **Sara** (AI sales assistant in Darija)
- Delivery company: **Riyalto Express** (users.riyaltoexpress.com)
- Riyalto login: email/password stored in Flask app.py as `RIYALTO_EMAIL` and `RIYALTO_PASSWORD`

---

## 2. THE TWO SYSTEMS

### System A — Flask App on VPS (Python backend)
- **VPS IP:** `178.105.60.185`
- **SSH:** `root` / `elarain123`
- **Port:** `5000`
- **File location:** `/root/waha_bot/app.py`
- **Log file:** `/root/waha_bot/flask.log`
- **Start command:** `cd /root/waha_bot && nohup python3 app.py >> flask.log 2>&1 &`
- **Stop command:** `pkill -f "python3 app.py"`
- **Health check:** `curl http://localhost:5000/api/orders`

### System B — Next.js Dashboard on Vercel (frontend)
- **Live URL:** `https://www.elarain.shop/anoir`
- **GitHub repo:** `https://github.com/Anoirhmt/jewerly-test-02.git`
- **Remote name:** `jewerly-test-02`
- **Branch:** `main`
- **Local folder:** `C:\Users\anoir\Downloads\elarain first projct - Copy`
- **Deploy:** automatic on every `git push jewerly-test-02 main`
- **Python for scripts:** use `py -3` (not `python3`) on Windows

---

## 3. ARCHITECTURE — HOW IT WORKS

```
Browser (elarain.shop/anoir)
    ↓ HTTPS
Next.js API routes (Vercel — server side)
    ↓ HTTP (no mixed content issue)
Flask app (VPS port 5000)
    ↓
Riyalto Express website (scraping via requests + session login)
    ↓
Local JSON backup files on VPS (persist even if Riyalto deletes orders)
```

**Why proxy routes?** Browser is HTTPS, VPS is HTTP. Browser blocks direct HTTP calls (mixed content error). So all API calls go: Browser → Vercel API route → VPS Flask → Riyalto.

---

## 4. FLASK APP — KEY DETAILS (app.py)

### Config variables at top of file:
```python
GEMINI_API_KEY   = "AIzaSyA4reSVihrJrYn45EpAyT9xuI-mwQofBAc"
WAHA_URL         = "http://localhost:3000"
WAHA_API_KEY     = "elarain123"
SESSION          = "default"
ADMIN_PASSWORD   = "elarain123"
RIYALTO_EMAIL    = (stored in file)
RIYALTO_PASSWORD = (stored in file)
RIYALTO_CLIENT   = "1190"
RETOURS_FILE     = "/root/waha_bot/retours.json"
ORDERS_FILE      = "/root/waha_bot/orders_backup.json"
ALL_COLIS_FILE   = "/root/waha_bot/all_colis_backup.json"
```

### Backup files on VPS:
| File | Purpose |
|------|---------|
| `/root/waha_bot/retours.json` | Tracks received/unreceived status for retours |
| `/root/waha_bot/orders_backup.json` | Backup of all failed/retour orders (persists even if deleted from Riyalto) |
| `/root/waha_bot/all_colis_backup.json` | Backup of ALL orders: encours + delivered + failed |

### JSON API endpoints (added by us, called by Next.js):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Failed orders (retours) with received status |
| `/api/receive` | POST | Mark order as received `{riya: "RIYA-..."}` |
| `/api/unreceive` | POST | Mark order as not received `{riya: "RIYA-..."}` |
| `/api/encours` | GET | Live en cours orders (nb=200) |
| `/api/delivered` | GET | Live delivered orders (nb=2000) |
| `/api/failed` | GET | Live failed/retour orders (nb=500) |

### How Riyalto scraping works:
```python
# Login via session
s = requests.Session()
s.get('https://users.riyaltoexpress.com/login.php')
s.post('https://users.riyaltoexpress.com/login.php', data={username, password, rememberme:'yes'})

# Fetch orders via AJAX
s.post('https://users.riyaltoexpress.com/ajax.php',
    data={'action': 'loadcommands', 'type': 'loadcmdfailed', 'state': '1', 'nbpage': '500', ...},
    headers={'X-Requested-With': 'XMLHttpRequest', 'Referer': 'commands.php?action=loadcmdfailed'})
```

### Three Riyalto order types:
- `loadcmdencours` → active orders (Mise en distribution, Injoignable, Reporté, 3 Jour Pas De Reponse)
- `loadcmddelivered` → delivered orders (Livré) — fetch nb=2000
- `loadcmdfailed` → failed/returned orders — feeds the retours dashboard

### Backup logic (same for all types):
- Every fetch → saves all orders to local JSON backup (RIYA code as unique key)
- If order disappears from Riyalto → marked `archived: true` but still shown
- If Riyalto is unreachable → returns local backup data instead of empty

### imports used for scraping (aliased to avoid conflicts):
```python
import requests as _req
import re as _re
```

### CORS headers (all API responses include):
```python
def _cors_headers():
    return {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}
```

---

## 5. NEXT.JS PROJECT STRUCTURE

```
app/
  anoir/
    layout.tsx          ← sidebar nav, counts from getRetourOrders()
    dashboard/page.tsx  ← real stats: encours + livrées + retours en attente + DH
    tous-les-colis/page.tsx ← 3 tabs: En cours | Livrées | Échouées, with search + refresh
    retours/page.tsx    ← retours list: En attente / Reçus tabs, scan FAB button
    retours-recus/page.tsx ← received orders table
    non-scannes/page.tsx   ← not yet received, with receive button
    scan/page.tsx          ← barcode scanner (photo capture, manual input)
    historique/page.tsx
    config/page.tsx
    sync/page.tsx
  api/
    retours/
      orders/route.ts    ← proxy → VPS /api/orders
      receive/route.ts   ← proxy → VPS /api/receive
      unreceive/route.ts ← proxy → VPS /api/unreceive
      encours/route.ts   ← proxy → VPS /api/encours (maxDuration: 30)
      delivered/route.ts ← proxy → VPS /api/delivered (maxDuration: 60)
      failed/route.ts    ← proxy → VPS /api/failed (maxDuration: 30)
      all-orders/route.ts ← old combined route (kept but not used)
lib/
  retours-api.ts    ← all API functions used by pages
```

### lib/retours-api.ts exports:
```typescript
interface RiyaltoOrder {
  riya, name, phone, price, state, city, date, archived, received, date_recu
}
interface RiyaltoOrderLight {
  riya, name, phone, price, state, city, date
}
interface AllOrders {
  encours: RiyaltoOrderLight[]
  delivered: RiyaltoOrderLight[]
  failed: RiyaltoOrderLight[]
  error: string | null
}

getRetourOrders()   → fetches /api/retours/orders
receiveOrder(riya)  → POST /api/retours/receive
unreceiveOrder(riya)→ POST /api/retours/unreceive
getAllOrders()       → calls encours + delivered + failed in parallel (Promise.all)
```

---

## 6. DASHBOARD PAGE — WHAT EACH CARD SHOWS

| Card | Source | Description |
|------|--------|-------------|
| En cours | `/api/encours` | Active orders currently being delivered |
| Livrées | `/api/delivered` | All delivered orders (nb=2000) |
| Retours en attente | `/api/orders` filtered | Failed orders where `received === false` |
| DH livrés | `/api/delivered` | Sum of all delivered order prices |

---

## 7. SCAN PAGE — HOW IT WORKS

- **Primary method:** Photo capture button (`<input type="file" accept="image/*" capture="environment">`)
- **Library:** `html5-qrcode` v2.3.8 loaded from CDN (`https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js`)
- **Why photo only (no live camera):** iOS Safari renders black screen with html5-qrcode live camera — photo capture works on all devices
- **Image resize:** Before scanning, resizes image to max 1400px via canvas (prevents memory issues)
- **On match:** calls `receiveOrder(riya)` → shows green success card with name/city/price
- **On no match:** shows red error card
- **Manual input:** form at bottom, also works with Bluetooth scanner
- **URL:** `elarain.shop/anoir/scan`

---

## 8. SIDEBAR NAV (layout.tsx)

```
PRINCIPAL
  Dashboard          → /anoir/dashboard
  Tous les colis     → /anoir/tous-les-colis
  Retours      [120] → /anoir/retours
  Retours reçus[104] → /anoir/retours-recus  (green badge)
  Non reçus     [16] → /anoir/non-scannes    (red badge)
  Scanner            → /anoir/scan
  Historique         → /anoir/historique

OUTILS
  Config API         → /anoir/config
  Cloud Sync         → /anoir/sync
```

Counts come from `getRetourOrders()` called on every route change.

---

## 9. RETOURS SYSTEM — FULL FLOW

1. Order fails/cancelled on Riyalto → appears in `loadcmdfailed`
2. `/api/orders` fetches it, merges into `orders_backup.json`
3. Dashboard shows it under **Non reçus** (received = false)
4. Anoir scans barcode or clicks "Reçu physiquement"
5. `/api/receive` called → saved to `retours.json` with `received: true, date_recu: today`
6. Order moves to **Retours reçus** tab
7. Can be undone with "Annuler la réception" → `/api/unreceive`

---

## 10. IMPORTANT BUGS FIXED (don't repeat these)

| Bug | Fix |
|-----|-----|
| Mixed content HTTPS→HTTP | Next.js proxy routes on Vercel |
| iOS Safari black camera | Removed live camera, photo capture only |
| Vercel timeout on all-orders | Split into 3 separate endpoints called in parallel |
| Livrées capped at 500 | Changed nb=500 → nb=2000 |
| Flask not starting | Use `python3` not `python` on VPS |

---

## 11. HOW TO DEPLOY CHANGES

### Update VPS (Flask):
```python
# Use py -3 on Windows with paramiko
import paramiko, time
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('178.105.60.185', username='root', password='elarain123', timeout=15)
sftp = ssh.open_sftp()
sftp.put(r'C:\Users\anoir\Downloads\claude\app.py', '/root/waha_bot/app.py')
sftp.close()
ssh.exec_command('pkill -f "python3 app.py"')
time.sleep(2)
ssh.exec_command('cd /root/waha_bot && nohup python3 app.py >> flask.log 2>&1 &')
ssh.close()
```

### Update Vercel (Next.js):
```bash
cd "C:\Users\anoir\Downloads\elarain first projct - Copy"
git add <files>
git commit -m "description"
git push jewerly-test-02 main
# Vercel deploys automatically
```

---

## 12. DELIVERY PRICES (from Sara bot system prompt)

Used to calculate net revenue per order:
- Rabat, Temara, Sale: 20-25 DH
- Casa, Fes, Marrakech, Agadir, El Jadida: 35 DH
- Taroudant, Safi, Asfi: 40 DH
- Dakhla, Chefchaouen, Khenifra, Driouch, Smara: 45 DH
- Default (city not found): 35 DH

---

## 13. OTHER SERVICES ON VPS

- **WAHA** (WhatsApp HTTP API): `http://localhost:3000`, API key: `elarain123`, session: `default`
- **Gemini API key:** `AIzaSyA4reSVihrJrYn45EpAyT9xuI-mwQofBAc`
- **Google Sheet (orders):** `https://script.google.com/macros/s/AKfycbz_JgFgRMcOd2B7wJPVWeIZRvM3yQ0QF4Hqm_-Jf06b9xpSIazvnvT1bMAowQkSRAbw/exec`
- **WhatsApp bot name:** Sara (AI sales assistant in Darija marocain)
- **Admin password:** `elarain123`

---

## 14. RIYALTO ORDER STATES

| State | Meaning | Tab |
|-------|---------|-----|
| Mise en distribution | Out for delivery | En cours |
| Injoignable | Customer unreachable | En cours |
| Reporté | Postponed | En cours |
| 3 Jour Pas De Reponse | 3 days no answer | En cours |
| Finale De Suivi | Final follow-up | En cours |
| Livré | Delivered ✅ | Livrées |
| Retourné / Annulé | Failed/returned | Échouées → Non scannés |

---

## 15. QUICK REFERENCE

| Thing | Value |
|-------|-------|
| Live site | https://www.elarain.shop/anoir |
| VPS | 178.105.60.185 |
| SSH user | root |
| SSH pass | elarain123 |
| Flask port | 5000 |
| Flask file | /root/waha_bot/app.py |
| Local Flask | C:\Users\anoir\Downloads\claude\app.py |
| Local Next.js | C:\Users\anoir\Downloads\elarain first projct - Copy |
| GitHub | https://github.com/Anoirhmt/jewerly-test-02.git |
| Git remote | jewerly-test-02 |
| Branch | main |
| Python cmd | py -3 (Windows) / python3 (VPS) |
