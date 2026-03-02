const BASE = 'http://localhost:8000'

export async function getNotes() {
    const res = await fetch(`${BASE}/notes`)
    return res.json()
}

export async function createNote(content) {
    const res = await fetch(`${BASE}/notes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content})
    })
    return res.json()
}

export async function deleteNote(id) {
    await fetch(`${BASE}/notes/${id}`, { method: 'DELETE' })
}