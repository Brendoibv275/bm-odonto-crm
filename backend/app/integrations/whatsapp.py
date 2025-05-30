from typing import Dict, Any, Optional, List
import httpx
from datetime import datetime
import json
import os
from dotenv import load_dotenv

load_dotenv()

class WhatsAppIntegration:
    def __init__(self):
        self.base_url = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
        self.api_key = os.getenv("EVOLUTION_API_KEY")
        self.instance_name = os.getenv("EVOLUTION_INSTANCE_NAME", "bm-odonto")
        
        if not self.api_key:
            raise ValueError("EVOLUTION_API_KEY não configurada")
    
    async def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Faz uma requisição para a Evolution API"""
        headers = {
            "apikey": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        async with httpx.AsyncClient() as client:
            try:
                if method == "GET":
                    response = await client.get(url, headers=headers)
                elif method == "POST":
                    response = await client.post(url, headers=headers, json=data)
                else:
                    raise ValueError(f"Método HTTP não suportado: {method}")
                
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Erro na requisição HTTP: {str(e)}")
                raise
    
    async def send_message(self, to: str, message: str) -> Dict[str, Any]:
        """Envia uma mensagem de texto via WhatsApp"""
        endpoint = f"message/sendText/{self.instance_name}"
        data = {
            "number": to,
            "text": message
        }
        
        return await self._make_request("POST", endpoint, data)
    
    async def send_template(
        self,
        to: str,
        template_name: str,
        components: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Envia uma mensagem usando template do WhatsApp Business"""
        endpoint = f"message/sendTemplate/{self.instance_name}"
        data = {
            "number": to,
            "template": template_name,
            "components": components
        }
        
        return await self._make_request("POST", endpoint, data)
    
    async def send_appointment_confirmation(
        self,
        to: str,
        patient_name: str,
        date: datetime,
        procedure: str
    ) -> Dict[str, Any]:
        """Envia confirmação de agendamento usando template"""
        formatted_date = date.strftime("%d/%m/%Y às %H:%M")
        
        components = [{
            "type": "body",
            "parameters": [
                {"type": "text", "text": patient_name},
                {"type": "text", "text": formatted_date},
                {"type": "text", "text": procedure}
            ]
        }]
        
        return await self.send_template(
            to=to,
            template_name="confirmacao_consulta",
            components=components
        )
    
    async def send_payment_confirmation(
        self,
        to: str,
        patient_name: str,
        amount: float,
        date: datetime
    ) -> Dict[str, Any]:
        """Envia confirmação de pagamento usando template"""
        formatted_date = date.strftime("%d/%m/%Y")
        formatted_amount = f"R$ {amount:.2f}"
        
        components = [{
            "type": "body",
            "parameters": [
                {"type": "text", "text": patient_name},
                {"type": "text", "text": formatted_amount},
                {"type": "text", "text": formatted_date}
            ]
        }]
        
        return await self.send_template(
            to=to,
            template_name="confirmacao_pagamento",
            components=components
        )
    
    async def send_reminder(
        self,
        to: str,
        patient_name: str,
        date: datetime,
        procedure: str
    ) -> Dict[str, Any]:
        """Envia lembrete de consulta usando template"""
        formatted_date = date.strftime("%d/%m/%Y às %H:%M")
        
        components = [{
            "type": "body",
            "parameters": [
                {"type": "text", "text": patient_name},
                {"type": "text", "text": formatted_date},
                {"type": "text", "text": procedure}
            ]
        }]
        
        return await self.send_template(
            to=to,
            template_name="lembrete_consulta",
            components=components
        ) 