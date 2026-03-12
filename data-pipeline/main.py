import os
from document_reader import DocumentReader
from web_scraper import WebScraper
from ai_extractor import AIGovernanceExtractor

def run_data_pipeline():
    """Main execution loop to process manifestos and web announcements using AI."""
    
    # Fetch the API key from environment variables
    api_key = os.environ.get("GEMINI_API_KEY") 
    
    if not api_key:
        print("Please set your GEMINI_API_KEY environment variable.")
        # For testing, you can uncomment the line below and add your key:
        # api_key = "YOUR_ACTUAL_API_KEY"
        return

    # Initialize our single-responsibility classes
    doc_reader = DocumentReader()
    web_scraper = WebScraper()
    extractor = AIGovernanceExtractor(api_key=api_key)

    # ==========================================
    # PHASE 1: PARSE LOCAL PDF MANIFESTOS
    # ==========================================
    print("\n--- PHASE 1: PROCESSING MANIFESTOS ---")
    manifestos_to_process = [
        {"file": "manifesto-2024.pdf", "party": "BJP", "year": 2024},
        {"file": "manifesto-2019.pdf", "party": "BJP", "year": 2019},
        {"file": "manifesto-2014.pdf", "party": "BJP", "year": 2014}
    ]

    for doc in manifestos_to_process:
        file_path = doc["file"]
        print(f"Reading PDF: {file_path}")
        raw_text = doc_reader.extract_text_from_pdf(file_path)
        
        if raw_text:
            print(f"Extracting {doc['year']} data via AI...")
            json_result = extractor.extract_manifesto_data(
                raw_text=raw_text, party=doc["party"], year=doc["year"], source=file_path
            )
            
            output_filename = f"{doc['party']}_{doc['year']}_manifesto.json"
            with open(output_filename, 'w', encoding='utf-8') as f:
                f.write(json_result)
            print(f"Saved -> {output_filename}")


   # ==========================================
    # PHASE 2: DYNAMICALLY SCRAPE WEB ANNOUNCEMENTS
    # ==========================================
    print("\n--- PHASE 2: PROCESSING WEB ANNOUNCEMENTS ---")
    
    # Dynamically fetch the 3 most recent announcements
    print("Fetching the latest press release links directly from PIB...")
    announcements_to_process = web_scraper.get_latest_pib_links(limit=3)

    if not announcements_to_process:
        print("No links found. Check your internet connection.")

    for index, url in enumerate(announcements_to_process):
        print(f"\nScraping URL: {url}")
        raw_text = web_scraper.fetch_article_text(url)
        
        if raw_text:
            print("Extracting announcement data via AI...")
            json_result = extractor.extract_announcement_data(
                raw_text=raw_text, source_url=url
            )
            
            output_filename = f"dynamic_announcement_{index + 1}.json"
            with open(output_filename, 'w', encoding='utf-8') as f:
                f.write(json_result)
            print(f"Saved -> {output_filename}")
        else:
            print(f"Failed to scrape or empty content for: {url}")