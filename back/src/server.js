import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const NOTES_FILE = path.join(__dirname, "data", "notes.json");

app.use(cors());
app.use(express.json());

async function initializeDataFile() {
  try {
    await fs.ensureDir(path.dirname(NOTES_FILE));
    const exists = await fs.pathExists(NOTES_FILE);
    if (!exists) {
      await fs.writeJson(NOTES_FILE, []);
    }
  } catch (error) {
    console.error("Помилка ініціалізації файлу даних:", error);
  }
}

// Функції для роботи з нотатками
async function readNotes() {
  try {
    return await fs.readJson(NOTES_FILE);
  } catch (error) {
    console.error("Помилка читання нотаток:", error);
    return [];
  }
}

async function writeNotes(notes) {
  try {
    await fs.writeJson(NOTES_FILE, notes, { spaces: 2 });
  } catch (error) {
    console.error("Помилка запису нотаток:", error);
    throw error;
  }
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Маршрути

//  отримати всі нотатки
app.get("/notes", async (req, res) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (err) {
    console.error("Помилка отримання нотаток:", err);
    res.status(500).json({ error: "Помилка отримання нотаток" });
  }
});

// створити нову нотатку
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title та content обов'язкові" });
    }

    const notes = await readNotes();
    const newNote = {
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    await writeNotes(notes);

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Помилка створення нотатки:", err);
    res.status(500).json({ error: "Помилка створення нотатки" });
  }
});

// редагувати нотатку
app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title та content обов'язкові" });
    }

    const notes = await readNotes();
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ error: "Нотатку не знайдено" });
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };

    await writeNotes(notes);
    res.json(notes[noteIndex]);
  } catch (err) {
    console.error("Помилка редагування нотатки:", err);
    res.status(500).json({ error: "Помилка редагування нотатки" });
  }
});

// видалити нотатку
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ error: "Нотатку не знайдено" });
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];
    await writeNotes(notes);

    res.json({ message: "Нотатку видалено", note: deletedNote });
  } catch (err) {
    console.error("Помилка видалення нотатки:", err);
    res.status(500).json({ error: "Помилка видалення нотатки" });
  }
});

// Додатковий маршрут для пошуку нотаток
app.get("/notes/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query параметр обов'язковий" });
    }

    const notes = await readNotes();
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredNotes);
  } catch (err) {
    console.error("Помилка пошуку нотаток:", err);
    res.status(500).json({ error: "Помилка пошуку нотаток" });
  }
});

// запускаєм
async function startServer() {
  await initializeDataFile();
  app.listen(PORT, () => {
    console.log(`🚀 Backend сервер запущено на http://localhost:${PORT}`);
    console.log(`📝 API endpoints:`);
    console.log(`   GET    /notes           - отримати всі нотатки`);
    console.log(`   POST   /notes           - створити нотатку`);
    console.log(`   PUT    /notes/:id       - редагувати нотатку`);
    console.log(`   DELETE /notes/:id       - видалити нотатку`);
    console.log(`   GET    /notes/search    - пошук нотаток`);
  });
}

startServer().catch(console.error);
