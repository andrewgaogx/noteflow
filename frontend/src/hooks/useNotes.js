import {useEffect, useState} from 'react'
import { getNotes, createNote, deleteNote, summarizeNote } from '../services/api'

export function useNotes() {
    const [notes, setNotes] = useState([])
    const [summarizingId, setSummarizingId] = useState(null)

    useEffect(() => {
        getNotes().then(setNotes)
    }, [])

    async function addNote(content) {
        const note = await createNote(content)
        setNotes(prev => [note, ...prev])
    }
    async function removeNote(id) {
        setNotes(prev => prev.filter(n => n.id !== id))
        await deleteNote(id)
    }

    async function summarize(id) {
        setSummarizingId(id)
        try {
            const data = await summarizeNote(id)
            setNotes(prev => prev.map(n => n.id === id ? {...n, summary: data.summary } : n))
        } finally {
            setSummarizingId(null)
        }
    }

    return { notes, addNote, removeNote, summarize }
}