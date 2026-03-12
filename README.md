# 🏛️ GovIntel: The Intelligent Governance Accountability Platform

**Built for the Augenblick Hackathon 2026**

## 👥 Team

* **Garv Lalla** - Team Leader
* **Sagar Bhatia**
* **Lavanya Khatwani**

---

## ⚠️ The Problem Statement (PS)

In modern democracies, governance data is massive, fragmented, and unstructured. Citizens, journalists, and policy analysts face a daunting challenge when trying to track policy execution and hold elected bodies accountable:

1. **Data Silos & Formatting Chaos:** Governance data exists in entirely different formats. Election manifestos are locked in historically inconsistent PDFs. Parliamentary records are buried in legislative archives, and daily government policy updates (like PIB press releases) are scattered across various web portals.
2. **The Accountability Gap:** There is no centralized mechanism to map a political promise (from a manifesto) to actual legislative action (parliamentary debates) and ultimate execution (government announcements).
3. **Technical Limitations:** Traditional web scrapers using regex and hardcoded HTML parsing fail the moment a government website updates its UI or a political party changes its manifesto graphic design.

## 💡 Our Complete Solution: GovIntel

**GovIntel** is an end-to-end, AI-driven platform that completely transforms how governance data is collected, linked, and presented to the public. We solve the fragmentation problem by replacing brittle scrapers with Large Language Models (LLMs), creating a system that not only reads but *understands* the data.

Our solution architecture is broken down into three comprehensive phases:

### Phase 1: Intelligent Data Aggregation (The Pipeline)

* **Universal Document Ingestion:** We built a zero-regex document reader that extracts text from any election manifesto, regardless of the year, font, or layout.
* **Dynamic Live Scraping:** The system automatically polls government RSS feeds (e.g., Press Information Bureau) to scrape the latest national policy announcements in real-time.
* **AI Semantic Structuring:** Using Gemini 1.5 Pro and strict Pydantic schemas, unstructured text is forced into standardized, predictable JSON objects (`Policy`, `Manifesto`, `GovernmentAnnouncement`, `ParliamentaryRecord`).

### Phase 2: Cross-Referencing & Analytics (The Engine)

* Once the data is standardized, GovIntel maps the connections. The system is designed to take a promise from a historical manifesto and semantically link it to a recent government press release, creating a verifiable, automated timeline of policy execution.

### Phase 3: Public Transparency Portal (The Interface)

* **Open Access Platform:** The platform is designed as a fully public-facing web application. To ensure zero barriers to entry for citizens, the architecture intentionally excludes gated admin portals or complex JWT authentication middlewares. It is open, transparent, and instantly accessible.
* **High-Tech UI:** Built with React and Tailwind CSS, the frontend features a futuristic dark theme with neon highlights, turning dry, complex policy data into an engaging and highly readable visual experience.

---

## ⚙️ Architecture & Tech Stack

### Data Pipeline & AI Backend

* **Language:** Python 3.9+
* **AI Engine:** Google Gemini 2.5 Flash (Structured JSON Outputs)
* **Data Modeling:** Pydantic
* **Extraction:** PyPDF2 (Static PDFs), BeautifulSoup4 & XML Parsing (Dynamic Web/RSS)

### Full-Stack Web Platform

* **Frontend Framework:** React with Tailwind CSS
* **Backend API:** Flask
* **Database:** MongoDB (Optimized for storing our AI-generated JSON documents)

---
