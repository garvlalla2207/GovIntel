import os
import time
import json
import re
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from google import genai
from dotenv import load_dotenv

# --- Configuration ---
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["govintel"]
collection = db["legislative_documents"]

def get_100_bill_links(target_count=100):
    """Bypasses CSS and HTML structure entirely by using raw Regex and Browser Headers."""
    print(f"📡 Deploying Deep Crawler to gather exactly {target_count} bills...")
    
    # Advanced Anti-Bot Headers
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
    }
    
    links = set()
    seed_urls = [
        "https://prsindia.org/bills/parliament",
        "https://prsindia.org/billtrack"
    ]
    
    for base_url in seed_urls:
        if len(links) >= target_count: break
            
        for page_num in range(0, 15): 
            url = f"{base_url}?page={page_num}" if page_num > 0 else base_url
            print(f"   📄 Scanning: {url}")
            
            try:
                response = requests.get(url, headers=headers, timeout=15)
                
                # Pure Regex Extraction (Ignores broken tables or dynamic DOMs)
                found_links = re.findall(r'href=["\']([^"\']*?/billtrack/[a-zA-Z0-9\-]+)["\']', response.text)
                
                found_on_page = 0
                for href in found_links:
                    if not href.endswith('/all') and 'category' not in href and 'sessiontrack' not in href:
                        full_url = "https://prsindia.org" + href if href.startswith('/') else href
                        if full_url not in links:
                            links.add(full_url)
                            found_on_page += 1
                            
                    if len(links) >= target_count:
                        break
                        
                print(f"   🔎 Found {found_on_page} new bills on this page.")
                
                # If a page returns 0 bills, PRS might have ended the list, so we move to the next seed URL
                if found_on_page == 0 and page_num > 0:
                    break 
                    
            except Exception as e:
                print(f"❌ Error crawling {url}: {e}")
                
    bill_list = list(links)
    print(f"\n✅ Successfully gathered {len(bill_list)} unique bill URLs.")
    return bill_list

def agent_extract_bill_details(url):
    """Dumps raw page text to Gemini and lets it structure the data."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Strip all scripts, styles, and footers to save AI tokens and clean the text
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        raw_text = soup.get_text(separator='\n', strip=True)
        
        prompt = f"""
        You are an expert legal AI for a Governance OS. Read the following raw website text about a legislative bill.
        Extract the facts and output a single JSON object EXACTLY matching this schema:
        
        {{
            "title": "Full Official Title of the Bill",
            "status": "Current Status (e.g., Passed, Pending, In Committee)",
            "simplified_summary": "A 2-3 sentence summary easily understood by the public.",
            "key_provisions": ["Short point 1", "Short point 2", "Short point 3"],
            "evolution_timeline": [
                {{ "stage": "Introduced", "date": "YYYY-MM-DD", "status": "completed" }},
                {{ "stage": "Status updates if any", "date": "YYYY-MM-DD or Unknown", "status": "completed or pending" }}
            ]
        }}
        
        If dates are missing, use 'Unknown'. If it's a very short text, do your best to summarize. DO NOT wrap the output in a list/array.
        
        RAW WEBSITE TEXT:
        {raw_text[:12000]}
        """
        
        ai_response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        
        bill_data = json.loads(ai_response.text)
        
        # --- THE FIX: AI SAFETY NET ---
        # If Gemini accidentally wraps the object in a list, extract the first item.
        if isinstance(bill_data, list):
            if len(bill_data) > 0:
                bill_data = bill_data[0]
            else:
                return None
        # ------------------------------
                
        bill_data['source_url'] = url
        return bill_data
        
    except Exception as e:
        print(f"   ❌ Agent failed to analyze {url}: {e}")
        return None

def run_true_agent():
    print("🚀 Booting OSINT Agentic Pipeline (High-Speed Mode)...")
    
    bill_urls = get_100_bill_links(target_count=100)
    
    if not bill_urls:
        print("🛑 Agent could not find any bills. Exiting.")
        return
        
    print(f"\n🧠 Beginning deep extraction of {len(bill_urls)} documents...\n")

    success_count = 0
    for i, url in enumerate(bill_urls):
        print(f"[{i+1}/{len(bill_urls)}] Agent analyzing: {url}")
        
        ai_data = agent_extract_bill_details(url)
        
        if ai_data and "title" in ai_data and ai_data["title"] != "Unknown":
            final_document = {
                "title": ai_data.get("title", "Unknown"),
                "doc_type": "Bill",
                "status": ai_data.get("status", "Pending"),
                "introduced_date": ai_data.get("evolution_timeline", [{}])[0].get("date", "Unknown") if ai_data.get("evolution_timeline") else "Unknown",
                "original_text": "Agentic Extraction. See source URL for full legal text.",
                "ai_analysis": {
                    "simplified_summary": ai_data.get("simplified_summary", "No summary generated."),
                    "key_provisions": ai_data.get("key_provisions", [])
                },
                "evolution_timeline": ai_data.get("evolution_timeline", []),
                "source_url": ai_data.get("source_url", url)
            }

            collection.update_one(
                {"title": final_document["title"]}, 
                {"$set": final_document}, 
                upsert=True
            )
            success_count += 1
            print(f"   ✅ Saved: {final_document['title'][:50]}...")
        else:
            print("   ⚠️ Skipped: Could not extract valid title.")
            
        time.sleep(0.5) 

    print(f"\n🎉 True Agent Pipeline Complete! {success_count} documents stored in MongoDB.")

if __name__ == "__main__":
    run_true_agent()