from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)

# ✅ CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Request body
class ChatRequest(BaseModel):
    query: str


@app.get("/")
def home():
    return {"message": "Supabase Chat API running 🚀"}


@app.post("/chat")
async def chat(req: ChatRequest):
    user_query = req.query.lower().strip()

    try:
        # ✅ TOP TOPICS (FIXED)
        if "top" in user_query and "topic" in user_query:
            response = supabase.table("articles") \
                .select("title, topic, views, likes") \
                .order("views", desc=True) \
                .limit(5) \
                .execute()

            return {
                "type": "table",
                "data": response.data
            }

        # ✅ AI ARTICLES
        elif "ai" in user_query:
            response = supabase.table("articles") \
                .select("id, title, topic, views, likes, created_at") \
                .ilike("topic", "%ai%") \
                .execute()

            return {
                "type": "table",
                "data": response.data
            }

        # ✅ DEVOPS ARTICLES
        elif "devops" in user_query:
            response = supabase.table("articles") \
                .select("id, title, topic, views, likes, created_at") \
                .ilike("topic", "%devops%") \
                .execute()

            return {
                "type": "table",
                "data": response.data
            }

        # ❌ DEFAULT MESSAGE
        else:
            return {
                "message": "Try: devops, ai articles, top topics"
            }

    except Exception as e:
        return {
            "error": str(e)
        }