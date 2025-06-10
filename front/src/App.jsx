import React, { useState, useEffect } from "react";
import NotesList from "./components/NotesList";
import NoteForm from "./components/NoteForm";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./services/api";
import "./styles/App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      setError("Помилка завантаження нотаток");
      console.error("Помилка завантаження нотаток:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes((prev) => [newNote, ...prev]);
      setError("");
    } catch (error) {
      setError("Помилка створення нотатки");
      console.error("Помилка створення:", error);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      setCurrentNote(null);
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Помилка оновлення нотатки");
      console.error("Помилка оновлення:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      try {
        await deleteNote(id);
        setNotes((prev) => prev.filter((note) => note.id !== id));
        if (currentNote && currentNote.id === id) {
          setCurrentNote(null);
          setIsEditing(false);
        }
        setError("");
      } catch (error) {
        setError("Помилка видалення нотатки");
        console.error("Помилка видалення:", error);
      }
    }
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCurrentNote(null);
    setIsEditing(false);
  };

  // фільтр
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (noteData) => {
    if (isEditing && currentNote) {
      handleUpdateNote(currentNote.id, noteData);
    } else {
      handleCreateNote(noteData);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Мої Нотатки</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Бігом шукай!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <main className="app-main">
        <div className="form-section">
          <NoteForm
            onSubmit={handleFormSubmit}
            initialData={currentNote}
            isEditing={isEditing}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className="notes-section">
          {loading ? (
            <div className="loading">Завантаження нотаток...</div>
          ) : (
            <NotesList
              notes={filteredNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Всього нотаток: {notes.length}
          {searchQuery && ` | Знайдено: ${filteredNotes.length}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
