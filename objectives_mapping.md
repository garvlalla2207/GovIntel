# GOVINTEL OSINT: Architecture & Objectives Mapping

## Part 1: How We Built It (Process Flow)

Our platform leverages a modern stack (React + Flask + MongoDB) supercharged by Google's **Gemini 2.0 Flash** model to handle complex data curation and interpretation. Here are the two core technical flows we built:

### Process 1: The AI-Curated Governance Network Graph

Instead of dumping raw database queries to the frontend (which causes visual clutter), we process the data through an LLM to curate the top nodes and calculate perfect spatial coordinates.

```text
+-------------------+       +-----------------------+       +------------------------+
|   MongoDB         |       |   Flask Backend       |       |   Gemini 2.0 Flash     |
| (Raw Commitments  | ----> | (GovernanceRepository)| ----> | (Data Architect Role)  |
|  & Bills)         |       | Extracts context for  |       | Selects Top 15 nodes,  |
+-------------------+       | the selected term     |       | calculates X/Y coords  |
                                    (e.g., 2024)    |       +-----------+------------+
                                    +---------------+                   |
                                            ^                           | (Returns Structured
                                            |                           |  JSON Graph)
                                            |                           v
+-------------------+       +---------------+-------+       +------------------------+
|  User Interface   |       |  React Frontend       |       |  Flask Backend         |
| (Term Switcher &  | <---- | (GovernanceNetwork)   | <---- |  Routes the JSON to    |
|  Cluster Toggles) |       | Renders dynamic SVG   |       |  the frontend via API  |
+-------------------+       +-----------------------+       +------------------------+

```

### Process 2: Intelligent Document Analysis (PDF Upload)

To analyze massive legislative documents (like the Uniform Civil Code Bill you tested), we built a pipeline that extracts binary PDF text and feeds it into the LLM for OSINT analysis.

```text
+-------------------+       +-----------------------+       +------------------------+
|  User Interface   |       |  Flask Backend        |       |   Gemini 2.0 Flash     |
| (AIAssistant.jsx) | ----> |  (chat_controller.py) | ----> | (OSINT Analyst Role)   |
| Uploads PDF Bill  |       |  Uses 'pypdf' to      |       | Generates 3-bullet     |
+-------------------+       |  extract raw text     |       | summary, maps to       |
                            |  from binary stream   |       | manifestos, flags risks|
                            +-----------------------+       +-----------+------------+
                                                                        |
+-------------------+                                                   |
|  User Interface   | <-------------------------------------------------+
| React-Markdown    |    (Returns formatted Markdown OSINT Brief)
| renders the UI    | 
+-------------------+ 

```

---

## Part 2: Mapping to Hackathon Objectives

Here is how our codebase explicitly solves the 9 objectives outlined in the `problem_statement.pdf`:

1. Governance Data Aggregation 

* **Requirement:** Collect governance-related information from multiple sources.


* **Our Process:** We built `LegislationRepository` and `AnalyticsService` in Flask to query MongoDB, effectively pulling isolated data (Manifestos and Legislative Documents) into unified API responses (`/api/v1/commitments`, `/api/v1/legislation`).

2. Manifesto & Policy Commitment Repository 

* **Requirement:** Organize political manifesto promises and categorize them by policy sectors.


* **Our Process:** In `GovernanceNetwork.jsx`, we introduced the `ClusterToggle` panel. Every promise is hard-mapped to a sector (e.g., `Healthcare System`, `Digital Transformation`, `Economy & Trade`), allowing users to instantly filter the dataset.

3. Legislative Document Intelligence 

* **Requirement:** Enable users to explore and interpret legislative materials like bills and amendments.


* **Our Process:** We built the `/ai/summarize-doc` endpoint using `pypdf`. It reads uploaded raw legislative PDFs (like the 266 of 2019 Bill) and makes them easily analyzable by summarizing their core tenets and financial impacts.

4. Promise-Policy Mapping Engine 

* **Requirement:** Connect election promises with legislative actions.


* **Our Process:** This is the core of our SVG Network. The backend defines explicit `edges` linking `source: "core"` (Manifesto) $\rightarrow$ `target: "promise"` $\rightarrow$ `target: "bill"`. It explicitly highlights promises that are "Stalled" (like the Labor Code or UCC Draft).

5. Legislative Evolution Tracking 

* **Requirement:** Track how policies evolve during the legislative process.


* **Our Process:** By passing `selectedTerm` (2014, 2019, 2024) from the React layout into our API calls, the platform visually tracks how promises from prior terms evolved into binding laws in subsequent terms.

6. Governance Accountability Analysis 

* 
**Requirement:** Evaluate the progress of political commitments and analyze legislative alignment.


* **Our Process:** The dashboard features a real-time `StatItem` grid. It calculates the **Success Rate (64%)** for manifesto alignment, tracks **Total Bills (142)**, and flags items currently **Pending Review (28)**.

7. Policy Relationship & Similarity Analysis 

* **Requirement:** Analyze relationships and group policies by thematic similarity.


* **Our Process:** Rather than manually sorting policies, we wrote a Gemini Prompt: *"Act as a Data Architect. Curate exactly 15-20 nodes... Grouping them by clusters"*. The AI detects relationships in the DB context and outputs a mathematically grouped graph JSON.

8. Policy Timeline & Governance Visualization 

* **Requirement:** Design visual tools, networks, and clusters to explore governance developments.


* **Our Process:** We built a high-performance SVG canvas in React. By using a radial (wheel) layout ($cos$ and $sin$ math generated by the AI backend), we plotted the Manifesto at the center, Promises in an inner ring, and Enacted/Stalled Bills in an outer ring—completely avoiding visual clutter.

9. Intelligent Policy Interpretation 

* **Requirement:** Integrate intelligent tools (LLMs) to assist users in understanding governance data, summarizing bills, and highlighting developments.


* **Our Process:** We built the floating `AIAssistant.jsx` component. Driven by **Gemini 2.0 Flash**, it acts as a conversational OSINT agent that reads uploaded documents, generates concise executive briefings, and checks if the uploaded bill aligns with current manifesto promises.


### Agent 1: The Manifesto & Political Commitment Scraper

This agent is responsible for scanning political party websites, downloading PDF manifestos, and using an LLM to extract and structure unstructured political text into measurable "Promises".

```text
+-----------------------+        +-------------------------+        +-----------------------+
|   External Sources    |        |   Manifesto OSINT Agent |        |   LLM Data Structuring|
| - Party Websites      | -----> | - PDF Text Extractor    | -----> | - Extracts Promises   |
| - Election Commission |        | - Web Crawler (Scrapy)  |        | - Categorizes Sector  |
| - Press Releases      |        | - OCR for scanned docs  |        |   (e.g., Healthcare)  |
+-----------------------+        +-------------------------+        +-----------+-----------+
                                                                                |
                                                                                | (Outputs clean JSON)
                                                                                v
                                                                    +-----------------------+
                                                                    |   MongoDB Database    |
                                                                    | Collection:           |
                                                                    | 'commitments'         |
                                                                    +-----------------------+

```

### Agent 2: The Legislative Tracking Agent

This agent continuously monitors parliamentary portals (like PRS Legislative Research, Lok Sabha/Rajya Sabha websites, and open Gov APIs) to ingest bills, track their current status (Passed, Stalled, Pending), and link them to the promises found by Agent 1.

```text
+-----------------------+        +-------------------------+        +-----------------------+
|   Government Portals  |        | Legislative Tracker Bot |        |   Data Normalization  |
| - Lok Sabha APIs      | -----> | - Polling mechanisms    | -----> | - Status Mapping      |
| - PRS Legislative     |        | - DOM Parsing (BS4)     |        |   (Stalled/Enacted)   |
| - Gazette of India    |        | - Bill Text Downloader  |        | - Cross-Referencing   |
+-----------------------+        +-------------------------+        +-----------+-----------+
                                                                                |
                                                                                | (Outputs clean JSON)
                                                                                v
                                                                    +-----------------------+
                                                                    |   MongoDB Database    |
                                                                    | Collection:           |
                                                                    | 'legislative_docs'    |
                                                                    +-----------------------+

```

### Integration Flow: The Mapping Engine (Objective 4)

Once both scraping agents have populated the database, a background chron-job (or the Gemini API during runtime) acts as the **Mapping Engine**  to connect the two datasets together based on semantic similarity.

```text
+-----------------------+                                           +-----------------------+
|     'commitments'     |                                           |  'legislative_docs'   |
|  (Agent 1 DB Output)  |                                           |  (Agent 2 DB Output)  |
+-----------+-----------+                                           +-----------+-----------+
            |                                                                   |
            |                   +-------------------------+                     |
            +-----------------> |   Semantic Mapping AI   | <-------------------+
                                | - Vector Similarity     |
                                | - Keyword Matching      |
                                | - Creates 'linked_bill' |
                                +-----------+-------------+
                                            |
                                            v
                                +-------------------------+
                                |  GOVINTEL Network API   |
                                | (Serves the React UI)   |
                                +-------------------------+

```

**Pitch Tip for the Judges:** When showing these diagrams, emphasize that your platform is not just a static dashboard, but a **living OSINT engine**. Explain that Agent 1 parses the *Promises*, Agent 2 tracks the *Reality* (the laws), and the Semantic Mapping AI bridges the gap to hold the government *Accountable*.