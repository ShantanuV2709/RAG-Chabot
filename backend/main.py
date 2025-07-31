from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from rag_chain import qa_chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str
    chat_history: List[Dict[str, Any]] = []

@app.post("/ask")
async def ask_question(query: Query):
    # Prepare input dictionary with keys the chain expects
    input_dict = {
        "question": query.question,
        "chat_history": query.chat_history
    }

    # Call the chain with the input dictionary (use __call__ to handle multiple output keys)
    result = qa_chain(input_dict)

    # Extract answer safely
    answer_text = result.get("answer", "No answer found.")

    return {"answer": answer_text}
