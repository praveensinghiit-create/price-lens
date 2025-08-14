import pandas as pd
from datetime import datetime
from typing import List, Dict
from .serp_service import SerpService

class GooglePriceMonitorService:
    def __init__(self, api_key: str):
        self.serp_service = SerpService(api_key)
        self.price_history = []
    
    def monitor_search_results(self, product_queries: List[str], 
                               price_range: tuple = None) -> List[Dict]:
        all_results = []
        
        for query in product_queries:
            try:
                results = self.serp_service.search_google(query)
                
                shopping_results = results.get('shopping_results', []) 
                
                if price_range:
                    min_price, max_price = price_range
                    shopping_results = [
                        p for p in shopping_results
                        if p.get('extracted_price') and 
                        min_price <= p['extracted_price'] <= max_price
                    ]
                
                for item in shopping_results: 
                    item['search_query'] = query
                    item['scraped_at'] = datetime.now().isoformat()
                
                all_results.extend(shopping_results) 
                
            except Exception as e:
                print(f"Error monitoring results for '{query}': {e}") # Keep message general for monitoring
        
        return all_results
    
    def get_search_result_comparison(self, query: str, min_price: float = None, 
                                     max_price: float = None) -> Dict:
        try:
            results = self.serp_service.search_google(query)
            
            items = results.get('shopping_results', []) 
            
            valid_items = [
                item for item in items 
                if item.get('extracted_price') is not None
            ]
            
            if not valid_items:
                return {"error": "No products with valid prices found from Google Shopping."} # CHANGED message
            
            prices = [p['extracted_price'] for p in valid_items]
            
            if not prices: 
                return {"error": "No valid numerical prices could be extracted from results after filtering."}


            if min_price is not None:
                valid_items = [p for p in valid_items if p['extracted_price'] >= min_price]
            if max_price is not None:
                valid_items = [p for p in valid_items if p['extracted_price'] <= max_price]
            
            return {
                "items": valid_items, 
                "price_stats": {
                    "min_price": min(prices) if prices else "N/A",
                    "max_price": max(prices) if prices else "N/A",
                    "avg_price": sum(prices) / len(prices) if prices else "N/A",
                    "total_items_with_price": len(valid_items)
                }
            }
            
        except Exception as e:
            return {"error": f"Google Shopping comparison failed: {str(e)}"} 
    
    def export_to_csv(self, results_data: List[Dict], filename: str = None) -> str:
        if not filename:
            filename = f"google_shopping_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        csv_data = []
        for item in results_data:
            csv_row = {
                'Title': item.get('title'),
                'Link': item.get('link'),
                'Extracted_Price': item.get('extracted_price'),
                'Original_Price': item.get('original_price'), 
                'Savings': item.get('savings'),             
                'Merchant': item.get('merchant'),           
                'Rating': item.get('rating'),               
                'Reviews': item.get('reviews'),             
                'Thumbnail': item.get('thumbnail'),         
                'Search_Query': item.get('search_query'),
                'Scraped_At': item.get('scraped_at')
            }
            csv_data.append(csv_row)
        
        df = pd.DataFrame(csv_data)
        df.to_csv(filename, index=False)
        return filename