from typing import List, Dict, Any, Optional
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage
from ..config import get_settings

class BaseAgent:
    def __init__(
        self,
        tools: List[BaseTool],
        system_message: str,
        temperature: float = 0.7,
        model_name: Optional[str] = None
    ):
        settings = get_settings()
        
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY não configurada no ambiente")
        
        self.llm = ChatOpenAI(
            temperature=temperature,
            model_name=model_name or settings.openai_model_name,
            api_key=settings.openai_api_key
        )
        
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        self.agent = create_openai_functions_agent(
            llm=self.llm,
            tools=tools,
            prompt=self.prompt
        )
        
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=tools,
            memory=self.memory,
            verbose=True
        )
    
    async def process_message(self, message: str) -> str:
        """Processa uma mensagem e retorna a resposta do agente"""
        try:
            response = await self.agent_executor.ainvoke({"input": message})
            return response["output"]
        except Exception as e:
            print(f"Erro ao processar mensagem: {str(e)}")
            return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente."
    
    def add_tool(self, tool: BaseTool) -> None:
        """Adiciona uma nova ferramenta ao agente"""
        self.agent_executor.tools.append(tool)
        # Recria o agente com as novas ferramentas
        self.agent = create_openai_functions_agent(
            llm=self.llm,
            tools=self.agent_executor.tools,
            prompt=self.prompt
        )
        self.agent_executor.agent = self.agent 