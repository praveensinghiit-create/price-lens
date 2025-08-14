import logging
from typing import Dict
from serpapi import GoogleSearch

logger = logging.getLogger(__name__)

class SerpService:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("SERP API key is required")
        self.api_key = api_key
        logger.info("[SerpService] Initialized with API key.")

    def search_google(self, query: str, category: str = None, gl: str = "za", hl: str = "en", num_results: int = 10) -> Dict:
        try:
            if not query.strip():
                raise ValueError("Search query cannot be empty.")

            full_query = query.strip()
            if category and category.strip():
                full_query = f"{full_query} {category.strip()}"

            params = {
                "engine": "google_shopping",   
                "q": full_query,
                "api_key": self.api_key,
                "gl": gl,  
                "hl": hl, 
                "num": min(num_results, 100)
            }

            logger.info(f"[SerpService] Initiating Google Shopping search with parameters: {params}")
            
            search = GoogleSearch(params)
            results = search.get_dict()

            if "error" in results:
                logger.error(f"[SerpService] SerpAPI error: {results['error']}")
                raise Exception(results["error"])

            logger.info("[SerpService] Google Shopping search completed successfully")
            return results

        except Exception as e:
            logger.exception("[SerpService] Exception during Google Shopping search.")
            raise Exception(f"Google Shopping search failed: {str(e)}")