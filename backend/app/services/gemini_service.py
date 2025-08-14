import requests
import json
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        logger.info("[GeminiService] Initialized.")

    def generate_text(self, chat_history: list) -> str:
        headers = {
            'Content-Type': 'application/json'
        }
        payload = {
            "contents": chat_history,
        }
        
        api_url = f"{self.base_url}?key={self.api_key}"

        try:
            logger.info(f"[GeminiService] Sending request to Gemini API. History length: {len(chat_history)}")
            response = requests.post(api_url, headers=headers, data=json.dumps(payload))
            response.raise_for_status()
            
            result = response.json()
            
            if result.get("candidates") and len(result["candidates"]) > 0 and \
               result["candidates"][0].get("content") and \
               result["candidates"][0]["content"].get("parts") and \
               len(result["candidates"][0]["content"]["parts"]) > 0:
                text = result["candidates"][0]["content"]["parts"][0].get("text", "")
                logger.info("[GeminiService] Received response from Gemini API.")
                return text
            else:
                logger.warning(f"[GeminiService] Unexpected API response structure: {result}")
                return "No response generated from the AI."

        except requests.exceptions.HTTPError as http_err:
            logger.error(f"[GeminiService] HTTP error occurred: {http_err} - {response.text}")
            raise Exception(f"Gemini API HTTP error: {response.text}")
        except requests.exceptions.ConnectionError as conn_err:
            logger.error(f"[GeminiService] Connection error occurred: {conn_err}")
            raise Exception("Gemini API connection error. Check network or API endpoint.")
        except requests.exceptions.Timeout as timeout_err:
            logger.error(f"[GeminiService] Timeout error occurred: {timeout_err}")
            raise Exception("Gemini API request timed out.")
        except requests.exceptions.RequestException as req_err:
            logger.error(f"[GeminiService] An error occurred during Gemini API request: {req_err}")
            raise Exception(f"Error calling Gemini API: {req_err}")
        except json.JSONDecodeError as json_err:
            logger.error(f"[GeminiService] JSON decode error: {json_err} - Response: {response.text}")
            raise Exception(f"Invalid JSON response from Gemini API: {response.text}")
        except Exception as e:
            logger.error(f"[GeminiService] An unexpected error occurred: {e}")
            raise Exception(f"An unexpected error occurred: {e}")