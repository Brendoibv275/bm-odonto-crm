from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

from .agents.dental_agent import DentalAgent
from .integrations.whatsapp import WhatsAppIntegration

load_dotenv()

app = FastAPI(
    title="BM Odonto CRM API",
    description="API para o sistema de CRM odontológico com integração WhatsApp",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class WhatsAppMessage(BaseModel):
    from_number: str
    message: str
    timestamp: Optional[str] = None

class AgentResponse(BaseModel):
    response: str
    action_taken: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class APIStatus(BaseModel):
    status: str = "online"
    version: str = "1.0.0"
    services: Dict[str, str] = {
        "whatsapp": "active",
        "ai_agent": "active"
    }

# Rota raiz para verificação de status
@app.get("/", response_model=APIStatus)
async def root():
    """
    Rota raiz para verificação de status da API
    """
    return APIStatus()

# Dependências
async def get_whatsapp():
    try:
        whatsapp = WhatsAppIntegration()
        return whatsapp
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao inicializar WhatsApp: {str(e)}")

async def get_agent(app_id: str = Header(...), user_id: str = Header(...)):
    try:
        agent = DentalAgent(app_id=app_id, user_id=user_id)
        return agent
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao inicializar agente: {str(e)}")

# Rotas
@app.post("/webhook/whatsapp", response_model=AgentResponse)
async def whatsapp_webhook(
    message: WhatsAppMessage,
    whatsapp: WhatsAppIntegration = Depends(get_whatsapp),
    agent: DentalAgent = Depends(get_agent)
):
    """
    Webhook para receber mensagens do WhatsApp e processá-las com o agente
    """
    try:
        # Processa a mensagem com o agente
        response = await agent.process_dental_query(message.message)
        
        # Envia a resposta de volta pelo WhatsApp
        await whatsapp.send_message(
            to=message.from_number,
            message=response
        )
        
        return AgentResponse(
            response=response,
            action_taken="message_processed",
            metadata={
                "from_number": message.from_number,
                "timestamp": message.timestamp
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar mensagem: {str(e)}"
        )

@app.post("/send/reminder")
async def send_appointment_reminder(
    to: str,
    patient_name: str,
    date: str,
    procedure: str,
    whatsapp: WhatsAppIntegration = Depends(get_whatsapp)
):
    """
    Envia um lembrete de consulta via WhatsApp
    """
    try:
        from datetime import datetime
        appointment_date = datetime.strptime(date, "%Y-%m-%d %H:%M")
        
        response = await whatsapp.send_reminder(
            to=to,
            patient_name=patient_name,
            date=appointment_date,
            procedure=procedure
        )
        
        return {"status": "success", "message_id": response.get("messageId")}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao enviar lembrete: {str(e)}"
        )

@app.post("/send/payment-confirmation")
async def send_payment_confirmation(
    to: str,
    patient_name: str,
    amount: float,
    date: str,
    whatsapp: WhatsAppIntegration = Depends(get_whatsapp)
):
    """
    Envia uma confirmação de pagamento via WhatsApp
    """
    try:
        from datetime import datetime
        payment_date = datetime.strptime(date, "%Y-%m-%d")
        
        response = await whatsapp.send_payment_confirmation(
            to=to,
            patient_name=patient_name,
            amount=amount,
            date=payment_date
        )
        
        return {"status": "success", "message_id": response.get("messageId")}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao enviar confirmação de pagamento: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 