# 🏛️ Governance Data Aggregation Pipeline

## 📖 Overview

This repository contains a fully automated, AI-driven backend data pipeline designed to aggregate, clean, and structure chaotic government data.

Instead of relying on fragile Regular Expressions (Regex) that break when document formatting changes, this pipeline leverages **Large Language Models (Gemini 2.5 flash)** alongside strict **Pydantic schemas** to intelligently read PDFs and web articles and instantly convert them into standardized JSON data.

---

## 🏗️ Architecture Design

The pipeline is built using the **Single Responsibility Principle**. Each stage of the ETL (Extract, Transform, Load) process is isolated into dedicated Python classes:

1. **The Ingestion Layer:**
* `document_reader.py`: Extracts raw text from static PDF documents (e.g., historical Election Manifestos) using `PyPDF2`.
* `web_scraper.py`: A dynamic web crawler that reads the live RSS feed from the Press Information Bureau (PIB) to fetch the newest URLs, then uses `BeautifulSoup` to scrape the article text.


2. **The Intelligence Layer:**
* `ai_extractor.py`: Acts as the brain of the pipeline. It takes the unstructured text dump from the ingestion layer and passes it to the Gemini API via Structured Outputs.


3. **The Data Modeling Layer:**
* `policy.py`, `manifesto.py`, `government_announcement.py`: Strict Pydantic models that define exactly how the data should be shaped. The AI is forced to return JSON that perfectly matches these schemas.


4. **The Orchestration Layer:**
* `main.py`: The master script that ties the phases together, running the PDF extractions first, followed by the dynamic web scraping, and finally saving the structured outputs to `.json` files.



---

## 🎯 Mapping to Hackathon Objective 1

This codebase was explicitly built to fulfill **Objective 1: Governance Data Aggregation**. Here is how our architecture maps to the prompt requirements:

| Objective 1 Requirement | How We Solved It |
| --- | --- |
| **Collect from multiple sources** | We ingest both **historical static data** (Election Manifesto PDFs) and **live dynamic data** (daily Government Announcements). |
| **Technique: Web Scraping** | `web_scraper.py` parses government XML RSS feeds and scrapes HTML paragraphs using `BeautifulSoup`. |
| **Technique: Data Pipelines** | `main.py` is an end-to-end automated pipeline (Extraction -> AI Transformation -> JSON Load) that runs without human intervention. |
| **Technique: External APIs** | We integrated the **Gemini 2.5 Flash API** as an advanced NLP extraction engine to bypass traditional scraping limitations. |
| **Gather, Clean, and Structure** | Unstructured, messy text (like fragmented PDF pages) is gathered, semantically cleaned by the LLM, and structured into rigid **Pydantic/JSON schemas**. |

---

## 📂 Folder Structure

```text
/data-pipeline
  ├── main.py                       # Pipeline orchestrator
  ├── document_reader.py            # PDF ingestion logic
  ├── web_scraper.py                # Live web/RSS ingestion logic
  ├── ai_extractor.py               # Gemini API transformation logic
  ├── manifesto.py                  # Pydantic schema for Manifestos
  ├── policy.py                     # Pydantic schema for Policies
  ├── government_announcement.py    # Pydantic schema for Announcements
  ├── parliamentary_record.py       # Pydantic schema for Records
  ├── /sample_pdfs                  # Drop PDF documents here
  └── README.md

```

---

## 🚀 Setup & Execution

### 1. Install Dependencies

Ensure you have Python 3.9+ installed, then run:

```bash
pip install google-generativeai pydantic PyPDF2 beautifulsoup4 requests

```

### 2. Environment Variables

You must provide a Gemini API key for the AI Extraction layer to function.

* **Mac/Linux:** `export GEMINI_API_KEY="your_api_key_here"`
* **Windows (CMD):** `set GEMINI_API_KEY="your_api_key_here"`
* **Windows (PowerShell):** `$env:GEMINI_API_KEY="your_api_key_here"`

### 3. Run the Pipeline

Execute the master script to process local PDFs and dynamically scrape the latest news:

```bash
python main.py

```

### 4. Output

The pipeline will generate clean `.json` files in your root directory (e.g., `BJP_2024_manifesto.json`, `dynamic_announcement_1.json`) ready to be seeded into a database or served to a frontend application.

---
