import os
import json
from document_reader import DocumentReader
from web_scraper import WebScraper
from ai_extractor import AIGovernanceExtractor
from database import MongoRepository

def run_pipeline():
    api_key = os.environ.get("GEMINI_API_KEY") 
    if not api_key:
        print("❌ Error: Set GEMINI_API_KEY environment variable.")
        return

    reader = DocumentReader()
    scraper = WebScraper()
    extractor = AIGovernanceExtractor(api_key=api_key)
    db_repo = MongoRepository() 

    # --- PHASE 1: PROCESSING MANIFESTOS (WITH CHUNKING) ---
    print("\n--- PHASE 1: PROCESSING MANIFESTOS ---")
    manifestos = [
        {"file": "manifesto-2014.pdf", "party": "BJP", "year": 2014}
    ]
    
    # Chunking Configuration
    CHUNKS_SIZE = 25000  # Number of characters per AI request
    OVERLAP = 2000       # Overlap to ensure no promise is cut in half

    for doc in manifestos:
        print(f"Reading {doc['file']}...")
        full_text = reader.extract_text_from_pdf(doc["file"])
        
        if full_text:
            text_length = len(full_text)
            print(f"Total Text Length: {text_length} characters. Starting chunked extraction...")
            
            start = 0
            chunk_count = 1
            
            while start < text_length:
                end = start + CHUNKS_SIZE
                chunk = full_text[start:end]
                
                print(f"Processing Chunk {chunk_count} (Chars {start} to {min(end, text_length)})...")
                
                # Send the specific chunk to the AI
                result = extractor.extract_manifesto_data(
                    chunk, 
                    doc["party"], 
                    doc["year"], 
                    f"{doc['file']} (Part {chunk_count})"
                )
                
                # Store the results of this chunk in MongoDB
                db_repo.store_manifesto(result)
                
                # Move to next chunk with overlap
                start += (CHUNKS_SIZE - OVERLAP)
                chunk_count += 1
        else:
            print(f"Skipping {doc['file']} - No text extracted.")

    # --- PHASE 2: PROCESSING LIVE ANNOUNCEMENTS ---
    print("\n--- PHASE 2: PROCESSING LIVE ANNOUNCEMENTS ---")
    links = scraper.get_latest_pib_links()
    for url in links:
        print(f"Scraping {url}...")
        text = scraper.fetch_article_text(url)
        if text:
            result = extractor.extract_announcement_data(text, url)
            db_repo.store_announcement(result)

    # --- PHASE 3: PROCESSING LEGISLATIVE DOCUMENTS ---
    print("\n--- PHASE 3: PROCESSING LEGISLATIVE DOCUMENTS ---")
    dummy_bill_text = "The Digital Personal Data Protection Bill, 2023 summary..."
    result = extractor.extract_legislative_data(dummy_bill_text, "https://sansad.in/bills")
    db_repo.store_legislative_document(result)

    print("\n✅ Pipeline Complete! Data is fully structured in MongoDB.")

if __name__ == "__main__":
    run_pipeline()