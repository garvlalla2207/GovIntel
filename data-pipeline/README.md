# 🏛️ GovIntel: Agentic Governance & Accountability Platform

## 📖 Overview

GovIntel is a fully automated, AI-driven platform designed to aggregate chaotic government data and track political accountability over a **12-year historical scope (2014–2026)**.

Beyond simple data ingestion, the platform utilizes **Agentic AI**—autonomous researchers powered by Gemini 2.0/2.5 Flash and Google Search—to verify if election promises have translated into real-world governance outcomes.

---

## 🏗️ Architecture Design

The pipeline follows a modular, layer-based architecture to ensure scalability and data integrity:

1. **The Ingestion Layer:**
*  `document_reader.py`: Extracts raw text from historical Election Manifesto PDFs.


*  `web_scraper.py`: A live crawler for the Press Information Bureau (PIB) RSS feed.




2. **The Intelligence Layer:**
* `ai_extractor.py`: Uses Gemini Structured Outputs to convert unstructured text into rigid Pydantic schemas.


3. **The Data Modeling Layer:**
* `policy.py`, `manifesto.py`, `government_announcement.py`: Defines the standardized schema for MongoDB storage.




4. **The Accountability & Research Layer (Agentic AI):**
* `auditor_agent.py`: **The Core Innovation.** An autonomous agent that takes each commitment, searches the live web for historical progress (2014–2026), and generates structured audit reports.




5. **The Orchestration Layer:**
* `main.py`: Coordinates the end-to-end flow from PDF ingestion to database seeding.

---

## 🎯 Mapping to Hackathon Objectives

This platform was architected to solve the **Augenblick Problem Statement** by transforming chaotic political promises into a structured accountability engine.

| Objective | How We Solved It |
| --- | --- |
| **Obj 1: Data Aggregation** | Multi-source ingestion of historical Election Manifesto PDFs and live news via `web_scraper.py` and `document_reader.py`. |
| **Obj 4: Mapping Engine** | The **Agentic Auditor** autonomously maps real-world policy announcements and news to specific manifesto promises using semantic matching. |
| **Obj 5: Evolution Tracking** | Monitors policy shifts over a 12-year window (2014, 2019, 2024 cycles) by comparing original "Promises" against actual "Legislative Actions." |
| **Obj 6: Accountability Analysis** | The AI assigns an objective status (**Fulfilled/Stalled**) and estimates implementation levels based on verified web evidence. |
| **Obj 8: Governance Visualization** | Every audited commitment generates a structured `timeline` array, ready for instant rendering in React-based visualizers. |
| **Obj 9: Intelligent Interpretation** | Converts dense, technical legislative jargon into citizen-friendly summaries using the Agentic research loop. |

---

## 🤖 The Agentic Research Layer (`auditor_agent.py`)

The standout feature of this pipeline is the **Autonomous Auditor**. Unlike static scrapers, this agent:

* **Self-Throttles:** Intelligently manages API quotas to process thousands of records without interruption.
* **Self-Heals:** Uses robust regex-based cleaning to fix malformed JSON on the fly (handling illegal trailing commas or escape sequences).
* **Deep Researches:** Uses the **Gemini Search Tool** to cross-reference promises with PIB releases, budget documents, and news archives from 2014–2026.

---

## 🚀 Setup & Execution

### 1. Environment Variables

The pipeline requires a Gemini API key. For the **Accountability Layer**, a Paid Tier account is recommended to support high-parallelization for 1,400+ commitments.

```bash
export GEMINI_API_KEY="your_api_key_here"

```

### 2. Run the Data Ingestion

Process local PDFs and dynamically scrape the latest news:

```bash
python main.py
```

### 3. Run the Agentic Auditor

Execute the autonomous research loop to audit all 1,459 commitments:

```bash
python auditor_agent.py

```

### 4. Output

The Auditor populates MongoDB with:

* **Fulfillment Status:** AI-verified progress (e.g., "Fulfilled", "Partially Fulfilled").
* **Evidence Links:** Primary URLs to news or government portals for ultimate transparency.
* **Historical Timeline:** A structured year-by-year evolution of the promise's implementation.

---
