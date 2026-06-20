from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chat_service import generate_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {
        "message": "Hello from FastAPI"
    }


@app.post("/chat")
def chat(req: ChatRequest):

    result = generate_response(req.message)

    return result