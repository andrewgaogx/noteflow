import { useState } from "react";
import styles from './NoteComposer.module.css';

export default function NoteComposer({ onAdd }) {
    const [input, setInput] = useState('')

    function handleSubmit() {
        if (!input.trim()) return
        onAdd(input)
        setInput('')
    }

    return (
        <div className={styles.composer}>
            <textarea
                className={styles.textarea}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Write a note..."
            />
            <button className={styles.addBtn} onClick={handleSubmit}>Add Note</button>
        </div>
    )
}