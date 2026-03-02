import { useNotes } from './hooks/useNotes';
import NoteCard from './components/NoteCard';
import NoteComposer from './components/NoteComposer';
import styles from './App.module.css'

export default function App() {
  const {notes, addNote, removeNote } = useNotes()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>NoteFlow</h1>
        <span className={styles.count}>{notes.length} notes</span>
      </header>

      <NoteComposer onAdd={addNote} />

      <ul className={styles.list}>
        {notes.map(note => (
          <NoteCard key={note.id} note={note} onDelete={removeNote} />
        ))}
      </ul>
    </div>
  )
}