from document_reader import DocumentReader

def test_text_extraction():
    # Replace with your actual file name
    file_to_test = "manifesto-2019.pdf" 
    
    print(f"--- Testing Extraction for: {file_to_test} ---")
    
    reader = DocumentReader()
    raw_text = reader.extract_text_from_pdf(file_to_test)
    
    if not raw_text.strip():
        print("❌ FAILURE: No text could be read from this PDF.")
        print("Possible Reason: The PDF might be scanned images (OCR needed) or is encrypted.")
    else:
        print("✅ SUCCESS: Text extracted successfully.")
        print("-" * 50)
        # Print only the first 1000 characters to verify
        print(raw_text[:1000] + "...") 
        print("-" * 50)
        print(f"Total Character Count: {len(raw_text)}")

if __name__ == "__main__":
    test_text_extraction()