from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base, Note
import anthropic
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https://.*\.vercel\.app",
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"]
)

class NoteCreate(BaseModel):
    content: str

@app.get("/notes")
def get_notes( db: Session = Depends(get_db)):
    return db.query(Note).order_by(Note.created_at.desc()).all()

@app.post("/notes")
def create_note(body: NoteCreate, db: Session = Depends(get_db)):
    note = Note(content=body.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.delete("/notes/{id}")
def delete_note(id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == id).first()
    db.delete(note)
    db.commit()
    return {"deleted": id}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/notes/{id}/summarize")
def summarize_note(id: int, db: Session = Depends(get_db)):    
    note = db.query(Note).filter(Note.id == id).first()
    
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        messages=[
            {
                "role":"user",
                "content": 
                    f"Summarize the following text in one concise sentence. Only output the summary, nothing else. If the text is too short to summarize, just repeat it as it is. Text: {note.content}"
        }
        ]
    )
    
    summary = message.content[0].text
    
    if message.stop_reason == "max_tokens":
        for punct in ['.', ',', '!', '?']:
            last = summary.rfind
            if last != -1:
                summary = summary[:last + 1]
                break
    
    note.summary = summary
    db.commit()
    db.refresh(note)
    return {"summary": note.summary, "truncated": message.stop_reason == "max_tokens"}