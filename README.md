# SpectraGuard  
🔗 Live Demo: https://spectaguard.netlify.app/

A web-based privacy and anonymity audit tool.

SpectraGuard analyzes how trackable your browser is by running real-time tests such as fingerprint entropy, canvas uniqueness, WebRTC leaks, headers exposure, and storage permissions. All evaluations are performed locally in the browser — no data is collected or transmitted.

---

## 🚀 Features

- **Browser Fingerprint Analysis**  
  Detects entropy, unique identifiers, and trackable characteristics.

- **Canvas Fingerprinting Test**  
  Evaluates whether your system generates a unique canvas hash.

- **WebRTC Leak Detection**  
  Checks for potential IP exposure through peer-to-peer channels.

- **Headers & Storage Inspection**  
  Analyzes cookies, localStorage, referrer, and other metadata.

- **Privacy Score (0–100)**  
  Weighted scoring model based on 4 core areas.

- **Instant Recommendations**  
  Personalized actions to improve anonymity.

- **Fully Client-Side & Secure**  
  No backend logging. All tests run locally.

---

## 📊 Technology Stack

- **Next.js 14 (App Router)**
- **React**
- **JavaScript**
- **TailwindCSS**
- **Lucide Icons**

---

## 🧪 Test Categories

| Test                | Description                               |
|--------------------|-------------------------------------------|
| Fingerprint        | Checks browser uniqueness                 |
| Canvas             | Evaluates canvas rendering fingerprint    |
| WebRTC             | Detects potential IP leaks                |
| Headers/Storage    | Reviews cookies & storage permissions     |

---

## 📦 Installation

```bash
git clone https://github.com/emrebaran12/SpectraGuard.git
cd SpectraGuard
npm install
npm run dev
