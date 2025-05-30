import aiohttp
from typing import Optional
import json

class EvolutionAPI:
    def __init__(self, api_key: str, instance_name: str, base_url: str):
        self.api_key = api_key
        self.instance_name = instance_name
        self.base_url = base_url.rstrip('/')
        self.headers = {
            "apikey": api_key,
            "Content-Type": "application/json"
        }

    async def send_message(self, to_number: str, message: str) -> dict:
        """Envia mensagem via WhatsApp usando a Evolution API"""
        url = f"{self.base_url}/message/sendText/{self.instance_name}"
        
        payload = {
            "number": to_number,
            "text": message
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Erro ao enviar mensagem: {error_text}")
                
                return await response.json()

    async def get_instance_status(self) -> dict:
        """Verifica o status da instância do WhatsApp"""
        url = f"{self.base_url}/instance/connectionState/{self.instance_name}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Erro ao verificar status: {error_text}")
                
                return await response.json()

    async def create_instance(self) -> dict:
        """Cria uma nova instância do WhatsApp"""
        url = f"{self.base_url}/instance/create"
        
        payload = {
            "instanceName": self.instance_name,
            "token": self.api_key,
            "qrcode": True
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Erro ao criar instância: {error_text}")
                
                return await response.json()

    async def delete_instance(self) -> dict:
        """Deleta a instância do WhatsApp"""
        url = f"{self.base_url}/instance/delete/{self.instance_name}"
        
        async with aiohttp.ClientSession() as session:
            async with session.delete(url, headers=self.headers) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Erro ao deletar instância: {error_text}")
                
                return await response.json()

    async def get_qrcode(self) -> dict:
        """Obtém o QR Code para conexão do WhatsApp"""
        url = f"{self.base_url}/instance/qrcode/{self.instance_name}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Erro ao obter QR Code: {error_text}")
                
                return await response.json() 