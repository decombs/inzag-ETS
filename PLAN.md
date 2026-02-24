# INZAG ETS — Implementation Plan

## Architecture Decision

**Current state:** Single-file SPA (`index.html`, 1,770 lines — all HTML/CSS/JS inline), deployed on GitHub Pages.

**Proposed structure:** Extract shared CSS and JS into separate files. Create individual HTML pages for countries and OEM partnership. Keep GitHub Pages deployment (zero-cost, zero-build).

```
inzag-ETS/
├── index.html                          (main landing — refactored)
├── css/
│   └── styles.css                      (extracted shared styles)
├── js/
│   ├── main.js                         (shared nav, chatbot, WhatsApp)
│   ├── calculator.js                   (enhanced calculator logic)
│   └── readiness.js                    (upgraded readiness assessment)
├── countries/
│   ├── south-africa.html
│   ├── botswana.html
│   ├── namibia.html
│   ├── mozambique.html
│   ├── ghana.html
│   └── angola.html
├── oem-partnership.html
├── assets/
│   ├── inzag-logo-transparent.png
│   ├── inzag-logo-white.png
│   └── inzag-logo.png
└── WHATSAPP-BOT-SETUP.md
```

---

## Phase 1: Refactor — Extract Shared CSS & JS

### Step 1.1: Create `css/styles.css`
- Extract the entire `<style>` block (~1,030 lines) from `index.html`
- Add new styles for: multi-page nav, WhatsApp widget, enhanced calculator, readiness wizard, OEM page

### Step 1.2: Create `js/main.js`
- Extract: nav toggle, scroll-based nav, Lucide init, chatbot widget, WhatsApp widget (new)

### Step 1.3: Create `js/calculator.js`
- Extract and enhance calculator logic (currently lines 1506-1553)

### Step 1.4: Create `js/readiness.js`
- Extract and enhance qualification checker (currently lines 1556-1577)

### Step 1.5: Update `index.html`
- Replace inline styles/scripts with external file references
- Add nav links to country pages and OEM partnership
- Verify everything still works identically

---

## Phase 2: Country-Specific Pages (6 pages)

### Page template structure:
1. Header/Nav — same as main site, with link back home + other countries
2. Hero — country-specific headline, flag emoji, local context
3. Problem — local financing rates vs ECA rates in local currency
4. Calculator — pre-filled with that country's defaults
5. Key Sectors — top 2-3 sectors relevant to that country
6. Qualification Check — same readiness assessment
7. How It Works — same 5-step process
8. CTA — country-specific contact + WhatsApp
9. Footer

### Country data:

**South Africa** — ZAR, 10-14% local rates, Mining/Manufacturing/Construction/Energy, reference JSE companies, BEE compliance note

**Botswana** — BWP, 8-12% local rates, Mining (diamonds/coal)/Construction/Energy, Vision 2036, SPEDU corridor

**Namibia** — NAD (pegged to ZAR), 10-14% local rates, Mining (uranium/diamonds)/Fishing/Construction, Husab mine, Harambee Plan

**Mozambique** — MZN, 18-25% local rates, Energy (LNG/gas)/Mining (coal)/Construction/Agriculture, Rovuma basin, Nacala corridor

**Ghana** — GHS, 22-30% local rates, Mining (gold)/Energy (oil & gas)/Construction, Ashanti belt, Jubilee field, AfCFTA HQ

**Angola** — AOA, 20-30% local rates, Oil & Gas/Mining (diamonds)/Construction/Agriculture, PRODESI program, post-oil diversification

### SEO per page:
- Unique `<title>`, `<meta description>`, Open Graph tags
- Target keywords: "equipment financing [country]", "ECA financing [country]"

### Cross-linking:
- New "Explore by Country" section on `index.html` with 6 cards
- Each country page links to other countries and back to main site

---

## Phase 3: Enhanced Calculator

### New inputs:
- Equipment type selector (Mining, Construction, Manufacturing, Energy, Transport)
- Equipment brand (optional text input)
- Currency toggle (USD / local currency)
- Down payment % slider (default: 15% ECA vs 30% local)
- ECA premium toggle (adds 1-3% insurance cost estimate)

### Enhanced outputs:
- Total interest paid over full term
- Total cost of ownership (upfront + interest + principal)
- Annual savings + total savings over full term
- Equivalency line: "Save enough to buy X additional units"
- Simple CSS bar chart comparing total costs visually

### Amortization schedule:
- Expandable toggle showing full payment table
- Month | Payment | Principal | Interest | Remaining Balance
- Side-by-side for local vs ECA

### Shareable results:
- Calculator state encoded in URL query params (`?amount=5000000&country=ZA&rate=5.5`)
- "Copy Link" button
- PDF export via `window.print()` with print-specific CSS (no library)

### Lead capture:
- After calculation: "Want a personalized proposal? Enter your email"
- Pre-fills `mailto:` link with calculation summary
- Future-ready for HubSpot/Brevo form embed

---

## Phase 4: WhatsApp Integration

### 4.1: Floating WhatsApp widget
- Green WhatsApp icon, positioned above existing chatbot button (bottom-right)
- Opens `https://wa.me/PHONENUMBER?text=PREFILLED_MESSAGE`
- Context-aware pre-filled messages:
  - Main page: "Hi, I'm interested in ECA equipment financing."
  - Country page: "Hi, I'm interested in ECA financing for [Country]."
  - After calculator: "Hi, I calculated savings of $X on $Y equipment."
  - After readiness: "Hi, I scored [result] on the readiness check."

### 4.2: WhatsApp Business bot setup guide
Create `WHATSAPP-BOT-SETUP.md` documenting:
- WhatsApp Business app setup (free, immediate)
- Auto-reply configuration: greeting message, away message, quick replies
- Recommended next step: WATI (wa.team) for automated flows
- Conversation flows mirroring website chatbot
- Template messages for API approval
- CRM integration approach
- Cost estimate (~$40-50/month for WATI starter)

### 4.3: WhatsApp CTAs across site
- Add "Chat on WhatsApp" alongside every "Contact Us" button
- Calculator results: "Discuss this quote on WhatsApp"
- Readiness assessment: "Talk to us on WhatsApp"
- OEM page: separate pre-fill for partnership inquiries

---

## Phase 5: Upgraded Readiness Assessment

### Multi-step wizard replacing current 6-checkbox list:

**Step 1 — Your Company**
- Company name (text)
- Country (dropdown)
- Primary sector (dropdown)

**Step 2 — Business Profile**
- Years in operation (radio: <3, 3-5, 5-10, 10+)
- Annual revenue (radio: <$5M, $5-20M, $20-50M, $50-150M, >$150M)
- Revenue currency (radio: Mostly local / Mix / Mostly USD-EUR)
- Debt situation (radio: None / Manageable / Significant)

**Step 3 — Equipment Needs**
- Equipment type (dropdown)
- Estimated value (radio: <$1M, $1-2M, $2-5M, $5-15M, >$15M)
- Preferred European origin (radio: Germany, Italy, UK, France, Sweden, Austria, Any)
- Timeline (radio: <3mo, 3-6mo, 6-12mo, >12mo)

**Step 4 — Results**

### Scoring (100 points total):
| Criterion | Weight | Top Score |
|-----------|--------|-----------|
| Years in operation | 15 | 10+: 15 |
| Annual revenue | 20 | $50-150M: 20 |
| Revenue currency | 15 | Mostly hard: 15 |
| Debt situation | 15 | None: 15 |
| Equipment value | 20 | $5-15M: 20 |
| Timeline | 5 | 3-12mo: 5 |
| Sector match | 10 | Mining: 10 |

### Result tiers:
- **75-100: Excellent Fit** (green) — "Strong match. Let's start your application."
- **50-74: Good Fit** (blue) — "Likely eligible. Let's discuss structure."
- **30-49: Possible Fit** (orange) — "May work, needs further assessment."
- **0-29: Currently Challenging** (grey) — "Not ideal now. Here's what would help..."

### UX:
- Progress bar at top (Step X of 4)
- Back button between steps
- Smooth slide transitions
- Summary card with all inputs shown at results step
- CTA: Book a Call + WhatsApp + Email

---

## Phase 6: OEM Partnership Page

### `oem-partnership.html` structure:

1. **Hero** — "Help Your African Clients Afford Your Equipment"
2. **Problem** — "68% of African equipment deals stall due to financing"
3. **How it works** (3 steps): Refer client → We structure financing → Client buys your equipment, you get paid in full
4. **Benefits grid** — Close stalled deals, Get paid faster, No risk, Competitive advantage, Market expansion, Co-branded proposals
5. **Partnership tiers**:
   - Referral Partner: refer clients, referral fee
   - Integrated Partner: joint proposals, co-branded materials, dedicated contact
   - Strategic Partner: exclusive territory, joint marketing, sales process integration
6. **Equipment & sectors** — European brands and types we finance
7. **FAQ** — Process timeline, minimum deal size, countries covered, referral fees
8. **Contact form** — Company, contact person, email, equipment types, African markets, message
9. **Footer**

### Links from main site:
- Footer: "For Equipment Manufacturers" link
- Sectors section: "Are you an OEM? Explore our partnership →"

---

## Phase 7: Final Integration

- Update nav on all pages: Home, How It Works, Calculator, Countries (dropdown), OEM Partners, Contact
- Chatbot + WhatsApp widgets on every page
- Consistent footer across all pages
- Test all pages in Chrome/Firefox/Safari + mobile
- Test calculator, readiness wizard, WhatsApp links, cross-page nav

---

## Implementation Order

| # | Phase | Why This Order |
|---|-------|---------------|
| 1 | Extract CSS/JS (Phase 1) | Foundation for everything |
| 2 | Enhanced Calculator (Phase 3) | Core tool, used by country pages |
| 3 | Readiness Assessment (Phase 5) | Core tool, used by country pages |
| 4 | WhatsApp Integration (Phase 4) | Quick win, used everywhere |
| 5 | Country Pages (Phase 2) | Uses all new components |
| 6 | OEM Partnership (Phase 6) | Independent page |
| 7 | Final Integration (Phase 7) | Polish |
