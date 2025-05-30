import uvicorn
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Obtém o host das variáveis de ambiente ou usa localhost como padrão
HOST = os.getenv("API_HOST", "127.0.0.1")  # 127.0.0.1 é o mesmo que localhost
PORT = int(os.getenv("API_PORT", "8000"))

if __name__ == "__main__":
    print(f"Iniciando servidor em http://{HOST}:{PORT}")
    print("Para acessar de outros dispositivos na rede, use seu IP local")
    print("Para descobrir seu IP local, execute 'ipconfig' no Windows")
    
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=True
    ) 