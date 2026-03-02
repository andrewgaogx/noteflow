import styles from './NoteCard.module.css';

export default function NoteCard({note, onDelete}) {
    return (
        <li className={styles.card}>
            <p className={styles.content}>{note.content}</p>
            <button className={styles.deleteBtn} onClick={() => onDelete(note.id)}>Delete</button>
        </li>
    )
}