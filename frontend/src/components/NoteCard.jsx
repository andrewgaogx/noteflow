import styles from './NoteCard.module.css';

export default function NoteCard({note, onDelete, onSummarize, isSummarizing }) {
    return (
        <li className={styles.card}>
            <div className={styles.body}>
                <p className={styles.content}>{note.content}</p>
                {note.summary && (
                    <div className={styles.summary}>
                        <span className={styles.summaryTag}>AI Summary</span>
                        <p>{note.summary}</p>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                {!note.summary && (
                    <button 
                        className={styles.summarizeBtn} 
                        onClick={() => onSummarize(note.id)}
                        disabled={isSummarizing}
                    >
                        {isSummarizing ? 'Summarizing...' : "Summarize"}
                    </button>
                )}
                <button className={styles.deleteBtn} onClick={() => onDelete(note.id)}>Delete</button>
            </div> 
        </li>
    )
}