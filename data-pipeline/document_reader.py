import PyPDF2

class DocumentReader:
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        raw_text = ""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        raw_text += text + "\n"
            return raw_text
        except FileNotFoundError:
            print(f"Error: The file '{file_path}' was not found.")
            return ""
        except Exception as e:
            print(f"An unexpected error occurred while reading '{file_path}': {e}")
            return ""