import httpx
from typing import Dict, Any, Optional
from ..config import get_settings

class EvolutionService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.evolution_api_url
        self.api_key = self.settings.evolution_api_key
        self.headers = {
            "apikey": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def send_message(self, instance: str, to: str, message: str) -> Dict[str, Any]:
        """Envia uma mensagem via WhatsApp usando a API do Evolution"""
        if not self.api_key:
            raise ValueError("EVOLUTION_API_KEY não configurada no ambiente")
            
        url = f"{self.base_url}/message/sendText/{instance}"
        payload = {
            "number": to,
            "text": message
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
    
    async def get_instance_status(self, instance: str) -> Dict[str, Any]:
        """Obtém o status de uma instância do WhatsApp"""
        if not self.api_key:
            raise ValueError("EVOLUTION_API_KEY não configurada no ambiente")
            
        url = f"{self.base_url}/instance/connectionState/{instance}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
    
    async def create_instance(self, instance_name: str) -> Dict[str, Any]:
        """Cria uma nova instância do WhatsApp"""
        if not self.api_key:
            raise ValueError("EVOLUTION_API_KEY não configurada no ambiente")
            
        url = f"{self.base_url}/instance/create"
        payload = {
            "instanceName": instance_name,
            "token": self.api_key,
            "qrcode": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
    
    async def delete_instance(self, instance: str) -> Dict[str, Any]:
        """Deleta uma instância do WhatsApp"""
        if not self.api_key:
            raise ValueError("EVOLUTION_API_KEY não configurada no ambiente")
            
        url = f"{self.base_url}/instance/delete/{instance}"
        
        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=self.headers)
            response.raise_for_status()
            return response.json() 