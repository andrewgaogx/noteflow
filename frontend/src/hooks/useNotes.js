import {useEffect, useState} from 'react'
import { getNotes, createNote, deleteNote } from '../services/api'

export function useNotes() {
    const [notes, setNotes] = useState([])

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

    return { notes, addNote, removeNote }
}