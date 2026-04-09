from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv

# ✅ ADD THIS
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# ✅ ADD THIS BLOCK (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class ChatRequest(BaseModel):
    query: str


@app.post("/chat")
async def chat(req: ChatRequest):
    user_query = req.query.lower()

    if "top" in user_query and "topic" in user_query:
        response = supabase.table("articles") \
            .select("topic, views") \
            .order("views", desc=True) \
            .limit(5) \
            .execute()

        return {"type": "table", "data": response.data}

    elif "ai" in user_query:
        response = supabase.table("articles") \
            .select("*") \
            .ilike("topic", "%AI%") \
            .execute()

        return {"type": "table", "data": response.data}

    elif "devops" in user_query:
        response = supabase.table("articles") \
            .select("*") \
            .ilike("topic", "%DevOps%") \
            .execute()

        return {"type": "table", "data": response.data}

    else:
        return {"message": "Try queries like: top topics, AI articles, DevOps"}