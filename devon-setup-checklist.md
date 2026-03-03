# Devon Alexander — 1-Hour AI OS Setup Checklist

> **Date:** March 3, 2026
> **Prepared by:** Mike Davis
> **Purpose:** Step-by-step checklist for installing the AI OS Blueprint and configuring it for Devon's private money lending operations.

---

## PRE-CALL PREP (Mike does this before the call)

- [ ] Send Devon the proposal link: `https://ai-os-landing-nine.vercel.app/devon-alexander-proposal.html`
- [ ] Send Devon the product page: `https://ai-os-landing-nine.vercel.app`
- [ ] Confirm Devon has a Mac or PC (Claude Desktop runs on both)
- [ ] Confirm Devon has an Anthropic account (or help him create one on the call)
- [ ] Have the AI OS Blueprint Tier 1 zip ready to share/screen share

---

## PHASE 1: INSTALL (Minutes 0–10)

### Step 1: Download Claude Desktop
- [ ] Go to https://claude.ai/download
- [ ] Download Claude Desktop app (Mac or Windows)
- [ ] Install and open the app
- [ ] Sign in with Anthropic account

### Step 2: Open the Code Tab
- [ ] Click on the **Code** tab (not Chat) in Claude Desktop
- [ ] This gives full system access — file system, terminal, everything

### Step 3: Load the AI OS Blueprint
- [ ] Open a terminal/project in Code tab pointed at Devon's home directory
- [ ] Create the `.claude/` directory structure:
  ```
  ~/.claude/
  ├── CLAUDE.md          ← Devon's identity + business context
  ├── brain/             ← Shared brain (goals, projects, people, SOPs)
  │   ├── goals.md
  │   ├── projects/
  │   ├── people/
  │   ├── sops/
  │   └── daily/
  ├── skills/            ← Reusable capabilities
  └── commands/          ← Slash commands
  ```

---

## PHASE 2: CONFIGURE IDENTITY (Minutes 10–20)

### Step 4: Build Devon's CLAUDE.md
- [ ] Customize the identity file for Devon's operation:
  - Who Devon is (real estate developer, private money lender)
  - His business model (development projects, fractional fund, syndication)
  - His team structure (operators, their roles)
  - Communication style preferences
  - Key rules and guardrails

### Step 5: Set up Goals
- [ ] Create `~/.claude/brain/goals.md` with Devon's priorities:
  - Investor communication consistency
  - Team accountability
  - Deal pipeline organization
  - Reduce response time to lenders
  - Zero dropped follow-ups

### Step 6: Set up Projects
- [ ] Create `~/.claude/brain/projects/` with active deals:
  - Each property/project gets a file
  - Status, timeline, budget, investors attached
  - Next milestones and deadlines

---

## PHASE 3: LOAD DATA (Minutes 20–35)

### Step 7: Load Lender CRM
- [ ] Create `~/.claude/brain/people/` entries for each private money lender:
  - Name, contact info, preferred communication method
  - Total invested, which deals they're in
  - Last contact date
  - Relationship notes (preferences, concerns, style)
  - Risk tolerance / investment criteria

### Step 8: Load Active Deals
- [ ] For each active project, capture:
  - Property address and description
  - Purchase price, rehab budget, ARV
  - Lending structure (who lent what, rates, terms)
  - Current status and timeline
  - Next milestones
  - Any delays or issues

### Step 9: Connect CRM (if applicable)
- [ ] If Devon uses a CRM (Pipedrive, HubSpot, etc.):
  - Get API token
  - Connect and pull existing data
  - Sync lender contacts and deal pipeline
- [ ] If no CRM: the brain/ structure IS the CRM now

---

## PHASE 4: FIRST AUTOMATION (Minutes 35–45)

### Step 10: Generate Investor Updates
- [ ] Ask AI to draft updates for ALL active lenders
- [ ] Review output — each should reference:
  - Lender's name and specific investment
  - Current deal status
  - Updated timeline (if changed)
  - Their security position
  - Next expected milestone
- [ ] Devon reviews and approves

### Step 11: Build a Deal Package
- [ ] Pick Devon's newest or upcoming deal
- [ ] Ask AI to generate a full lender package:
  - Executive summary / investment memo
  - Deal breakdown (purchase, rehab, ARV, margins)
  - Security analysis (LTV, position, collateral)
  - Projected returns and timeline
  - Risk factors and mitigation
- [ ] Devon reviews — this is the "holy shit" moment

### Step 12: Flag Communication Gaps
- [ ] Ask AI: "Which lenders haven't gotten an update in over 2 weeks?"
- [ ] Ask AI: "What team tasks are overdue?"
- [ ] Ask AI: "What deals have upcoming milestones in the next 30 days?"
- [ ] See the AI catch real gaps in real time

---

## PHASE 5: SOPS & TEAM (Minutes 45–55)

### Step 13: Define Team SOPs
- [ ] Create SOPs for Devon's core workflows:
  - **Lender Update SOP:** Cadence, format, who sends, what's included
  - **New Deal Intake SOP:** How a new project gets loaded, lender package flow
  - **Follow-Up SOP:** Max days between lender contacts, escalation rules
  - **Team Reporting SOP:** What each team member reports, when, to whom

### Step 14: Set Follow-Up Rules
- [ ] Define cadences:
  - Active deal lenders: update every ____ days (suggest 7-14)
  - Delayed project lenders: update every ____ days (suggest 3-7)
  - Prospective lenders: follow-up every ____ days
  - Team check-ins: daily/weekly

---

## PHASE 6: GO-FORWARD (Minutes 55–60)

### Step 15: Week 1 Action Plan
- [ ] Send all drafted investor updates (today or tomorrow)
- [ ] Generate deal packages for any deals needing capital
- [ ] Set up daily check: "What needs my attention today?"
- [ ] Run first team accountability check

### Step 16: 30-Day Milestones
- [ ] Week 1: All lenders updated, deal packages generated
- [ ] Week 2: Follow-up system catching gaps, team using SOPs
- [ ] Week 3: Devon doing a fraction of the comms manually
- [ ] Week 4: Testimonial — what changed, what's different

### Step 17: Testimonial Agreement
- [ ] Devon agrees to:
  - Use the system for 30 days
  - Provide honest testimonial (video preferred, written works too)
  - Share specific results (time saved, lender satisfaction, deals closed)

---

## DEVON'S POST-CALL DAILY WORKFLOW

Every morning, Devon opens Claude Code tab and says:

```
Good morning. What needs my attention today?
```

The AI responds with:
- Lenders who need updates today
- Team tasks that are overdue
- Deals with upcoming milestones
- Any flagged issues from yesterday
- Draft communications ready for review

Every evening:

```
End of day. What happened, what's still open?
```

The AI logs what got done, what slipped, and sets up tomorrow.

---

## KEY METRICS TO TRACK (for testimonial)

| Metric | Before | After (30 days) |
|--------|--------|-----------------|
| Avg days between lender updates | ? | Target: <7 |
| Dropped follow-ups per week | ? | Target: 0 |
| Time to generate deal package | ? days | Target: <30 min |
| Lender complaints about communication | ? | Target: 0 |
| Hours Devon spends on comms/week | ? | Target: 50% reduction |

---

*This checklist was generated using the AI OS Blueprint. The system builds its own documentation.*
