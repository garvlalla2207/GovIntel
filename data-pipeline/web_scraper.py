import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

class WebScraper:
    """Handles extracting raw text and finding links from government portals."""
    
    @staticmethod
    def get_latest_pib_links(limit: int = 5) -> list:
        """Dynamically fetches the latest press release URLs from the official PIB RSS feed."""
        # This specific URL targets the English (Lang=1), National (Regid=3) press releases
        rss_url = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"
        links = []
        
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            response = requests.get(rss_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse the XML RSS feed using Python's built-in ElementTree
            root = ET.fromstring(response.content)
            
            # Traverse the XML tree: <rss> -> <channel> -> <item> -> <link>
            for item in root.findall('./channel/item')[:limit]:
                link_tag = item.find('link')
                if link_tag is not None and link_tag.text:
                    links.append(link_tag.text)
                    
        except Exception as e:
            print(f"Failed to fetch RSS feed: {e}")
            
        return links

    @staticmethod
    def fetch_article_text(url: str) -> str:
        """Fetches a URL and extracts the main paragraph text."""
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            paragraphs = soup.find_all('p')
            article_text = "\n".join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
            
            return article_text
            
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch {url}: {e}")
            return ""