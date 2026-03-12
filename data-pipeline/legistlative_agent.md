# GovIntel OSINT Legislative Agent

This module is an autonomous data pipeline designed to fuel the **Legislative Explorer** component of the GovIntel platform. Instead of relying on fragile CSS selectors that break when a website updates, this agent uses a hybrid approach: deep regular expression crawling combined with Large Language Model (LLM) text comprehension.

It actively targets the PRS Legislative Research database, extracts unstructured legal text, and uses Google's Gemini 2.0 Flash to synthesize the data into a highly structured, UI-ready format in MongoDB.

## How It Works

The pipeline is split into two specialized phases to ensure speed, accuracy, and resilience against bot-protections.

**Phase 1: The Deep Crawler**
Traditional scrapers fail when websites change their class names or use dynamic rendering. This crawler disguises itself as a standard web browser and uses pure Regular Expressions (Regex) to hunt for valid bill URLs directly from the raw HTML source code. It handles pagination automatically and deduplicates links in real-time.

**Phase 2: The Agentic Extractor**
Once a valid URL is found, the agent strips the page of all scripts, navigation bars, and styling. The raw, visible text is then injected into Gemini 2.0 Flash's context window. The AI acts as a legal analyst, reading the raw text and deterministically outputting a strict JSON object containing public-friendly summaries, key provisions, and timeline events.

## Prerequisites

You will need a local MongoDB instance running and an active API key for Google's Gemini.

1. Python 3.8+
2. MongoDB Community Edition (running on `mongodb://localhost:27017/`)
3. A `.env` file in the root directory containing your API key:
```env
GEMINI_API_KEY="your_api_key_here"

```



## Installation

Install the required dependencies using pip.

```bash
pip install requests beautifulsoup4 pymongo google-genai python-dotenv

```

## Usage

To start the pipeline, simply execute the Python script. The agent will begin gathering links and will provide terminal feedback for every document it analyzes and upserts into the database.

```bash
python legislatures_agent.py

```

*Note: The script includes a deliberate 0.5-second delay between requests to respect the target server's bandwidth and prevent IP blacklisting.*

## Database Schema

The agent guarantees that every document pushed to the `legislative_documents` MongoDB collection adheres to the following structure, making it immediately consumable by the React frontend.

```json
{
  "title": "The Telecommunications Bill, 2023",
  "doc_type": "Bill",
  "status": "Passed",
  "introduced_date": "2023-12-18",
  "original_text": "Agentic Extraction. See source URL for full legal text.",
  "ai_analysis": {
    "simplified_summary": "The Telecommunications Bill, 2023, seeks to replace the Indian Telegraph Act, 1885... establishing a new regulatory framework.",
    "key_provisions": [
      "Requires authorization from the central government...",
      "Allocates spectrum through auction..."
    ]
  },
  "evolution_timeline": [
    {
      "stage": "Introduced in Lok Sabha",
      "date": "2023-12-18",
      "status": "completed"
    }
  ],
  "source_url": "https://prsindia.org/..."
}

```

## Error Handling

The agent includes a strict validation gate. If the AI hallucinates, returns an array instead of an object, or encounters a "Category" page instead of a real bill, the agent will catch the anomaly, log a warning (`⚠️ Skipped: Not a valid bill page`), and proceed to the next URL without contaminating the database.