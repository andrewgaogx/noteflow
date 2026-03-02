from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base, Note

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

# notes = [
#     {"id": 1, "content": "My first note"},
#     {"id": 2, "content": "My second note"},
# ]
# next_id = 3

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