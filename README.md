# Bhoomisutra – AI-Powered Land Record Digitization & Validation System

> **Tagline**: *"Digitize. Compare. Validate. Verify."*  
> **SIH 2026 Problem Statement**: SIH26018 – Intelligent Land Record Digitization & Validation System  
> **Theme**: Smart Automation  

---

## 1. Executive Summary & Core Principle

**Bhoomisutra is not replacing existing land-record systems. It acts as an intelligent validation layer over digitized records.**

Instead of verifying a scanned land document in isolation, Bhoomisutra links the record to its ancestral cadastral parcel lineage, runs deterministic statutory land-law consistency rules, computes an explainable calibrated trust score, and highlights potential inconsistencies for authorized revenue officers.

### Controlled Legal Terminology
- **Permitted Terms**: *Potential inconsistency*, *Requires verification*, *Validation result*, *Confidence*, *Trust score*, *Review required*, *Evidence*, *Source document*, *Officer verification*.
- **Prohibited Terms**: *Fraud detected*, *Fake land*, *100% accurate*, *Legally verified*, *Guaranteed ownership*, *AI has final authority*.

---

## 2. 9-Stage Intelligent Verification Pipeline

```
01 SECURE INGEST & CHECKSUM
   ↓
02 RESTORE & PREPROCESS (OpenCV Deskew, Contrast, Layout Zones)
   ↓
03 CONSENSUS OCR (PaddleOCR + Tesseract Dual Consensus)
   ↓
04 CANONICALIZE & EXTRACT (Multilingual Hindi/Marathi/English Normalization)
   ↓
05 PARCEL LINEAGE GRAPH (Historical Chain Linking)
   ↓
06 LAND-LAW CONSISTENCY INVARIANTS (8 Deterministic Statutory Rules)
   ↓
07 CALIBRATED TRUST SCORE (Explainable Weights: 80+ Clear · 50-79 Review · <50 Hold)
   ↓
08 OFFICER REVIEW & SPLIT-SCREEN EVIDENCE INSPECTION
   ↓
09 VERIFIED & SEALED TAMPER-EVIDENT AUDIT LEDGER
```

---

## 3. SIH 2026 Demo Environment Credentials

To inspect the system during judging, open the **Demo Access Portal** (`/login` or `/demo`):

| Role | Email | Password | Scope & Permissions |
| :--- | :--- | :--- | :--- |
| **Officer Demo** | `demo.officer@bhoomisutra.demo` | `Bhoomi@Demo2026` | Full document review, OCR crop inspector, value corrections, statutory approval |
| **Admin Demo** | `demo.admin@bhoomisutra.demo` | `Admin@Demo2026` | Officer provisioning, threshold configuration, system-wide audit inspection |
| **Citizen Demo** | `demo.citizen@bhoomisutra.demo` | `Citizen@Demo2026` | Private landholder view: only own records, friendly status, internal notes hidden |

*Note: All demo accounts are strictly synthetic for SIH presentation.*

---

## 4. Key Pre-loaded Demo Scenarios for Judges

### Scenario A: Clean & Consistent Record (CLEAR)
- **Parcel**: Survey No. 45/2, Village Anandpur, Pune
- **Owner**: Suresh Patil
- **Lineage**: Original 4.00 Acre (1998) → Sale (2008) → Partition into 2.50 Acre + 1.50 Acre = 4.00 Acre (Area Conserved).
- **Result**: **CLEAR (Trust Score: 94/100)**. All 8 rules PASS.

### Scenario B: Area Conservation Violation (HOLD) — *Core SIH Judge Demonstration*
- **Parcel**: Survey No. 88/3B, Village Kalyanpur, Nashik
- **Issue**: Parent parcel was 2.40 Acre. Partition deed allocated Plot 88/3A (1.30 Acre) + Plot 88/3B (1.35 Acre) = **2.65 Acre**.
- **Violation**: Child area exceeds parent parcel by **+0.25 Acre**!
- **Result**: **HOLD (Trust Score: 44/100)**.
- **Reason**: *"Child parcel area exceeds documented parent parcel area."*
- **Action**: *"Officer verification required. Check subdivision mutation memo before approving ledger update."*

### Scenario C: Chronology Irregularity (REVIEW)
- **Parcel**: Survey No. 112/1, Shivnagar, Solapur
- **Issue**: Mutation date appears prior to Sub-Registrar deed registration date.
- **Result**: **REVIEW (Trust Score: 68/100)**.

---

## 5. Technology Stack

- **Frontend**: Next.js / React 19, TypeScript, Tailwind CSS, Lucide Icons, Responsive Mobile-to-Desktop layout.
- **Backend / Store**: Reactive In-Memory & LocalStorage persistent state with PostgreSQL relational schema.
- **Image Preprocessing**: Deskew, Denoise, Adaptive Histogram Equalization, Zone layout detection.
- **OCR Engine**: Consensus OCR architecture (PaddleOCR multi-lingual + Tesseract fast fallback).
- **Validation Engine**: 8 deterministic rules (No hallucinated LLM validation for statutory checks).
- **Integrity**: Browser Web Crypto SHA-256 tamper-evident hash chain (`previous_hash + payload → hash`).
- **Reports**: Print/PDF generator formatted to official government certificate layout.

---

## 6. Local Setup & Running Instructions

### Prerequisites
- Node.js $\ge 18$
- npm or pnpm

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-org/bhoomisutra.git
cd bhoomisutra

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 7. PostgreSQL Database Deployment (Supabase)

1. Open [Supabase Dashboard](https://supabase.com).
2. Create a new PostgreSQL database project.
3. Open the **SQL Editor** tab.
4. Copy the entire contents of `schema.sql` into the SQL editor and execute.
5. All tables, custom enums, relations, and indexes will be created.

---

## 8. 3-Minute SIH Judge Walkthrough Checklist

1. Open website (`/`). Click **"Judge Demo: Area Mismatch (HOLD)"**.
2. Observe the **9-Stage Validation Pipeline** execute stage-by-stage.
3. In **Stage 06**, inspect the Area Conservation Invariant failure:
   - Parent: 2.40 Acre | Children: 2.65 Acre | Difference: +0.25 Acre.
4. Click **"Open Officer Review & Evidence"**:
   - Inspect the scanned document crop on the left.
   - Click any field to see the exact bounding box grounded on the document.
   - Click **"Correct Value"** to demonstrate officer value override with justification.
5. Notice that the correction immediately logs to the **Tamper-Evident SHA-256 Ledger**.
6. Click **"Validation Report"** and test the **"Print / Save as PDF"** feature.
7. Switch roles via the top-right profile dropdown to **Citizen** or **Admin** to prove strict RBAC enforcement.
