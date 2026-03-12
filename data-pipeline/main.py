import os
from document_reader import DocumentReader
from ai_extractor import AIGovernanceExtractor

def process_governance_documents():
    """Main execution loop to process manifestos using AI."""
    
    # Fetch the API key from environment variables
    api_key = os.environ.get("GEMINI_API_KEY") 
    
    if not api_key:
        print("Please set your GEMINI_API_KEY environment variable.")
        print("Example (Linux/Mac): export GEMINI_API_KEY='your_api_key'")
        print("Example (Windows CMD): set GEMINI_API_KEY='your_api_key'")
        # For quick local testing, you can temporarily hardcode it:
        # api_key = "YOUR_ACTUAL_API_KEY"
        return

    # Initialize our single-responsibility classes
    reader = DocumentReader()
    extractor = AIGovernanceExtractor(api_key=api_key)

    # Define the documents we want to process based on your uploaded files
    documents_to_process = [
        {"file": "manifesto-2024.pdf", "party": "BJP", "year": 2024},
        {"file": "manifesto-2019.pdf", "party": "BJP", "year": 2019},
        {"file": "manifesto-2014.pdf", "party": "BJP", "year": 2014}
    ]

    for doc in documents_to_process:
        file_path = doc["file"]
        print(f"\n--- Processing {file_path} ---")
        
        # 1. Read the PDF using DocumentReader
        raw_text = reader.extract_text_from_pdf(file_path)
        
        if not raw_text:
            print(f"Skipping {file_path} due to read error. Ensure the file is in the same directory.")
            continue
            
        # 2. Extract structured data using AIGovernanceExtractor
        print(f"Extracting {doc['year']} data via AI... (This might take a minute)")
        json_result = extractor.extract_manifesto_data(
            raw_text=raw_text, 
            party=doc["party"], 
            year=doc["year"], 
            source=file_path
        )
        
        # 3. Save to a JSON file
        output_filename = f"{doc['party']}_{doc['year']}_manifesto.json"
        try:
            with open(output_filename, 'w', encoding='utf-8') as f:
                f.write(json_result)
            print(f"Success! Saved structured data to {output_filename}")
        except Exception as e:
            print(f"Failed to save {output_filename}: {e}")

if __name__ == "__main__":
    process_governance_documents()