import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// перехоплюєм помилки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.code === "ECONNREFUSED") {
      throw new Error("Сервер недоступний. Перевірте, чи запущений backend.");
    }

    if (error.response) {
      throw new Error(error.response.data.error || "Помилка сервера");
    }

    throw new Error("Помилка мережі");
  }
);

export const getAllNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post("/notes", noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const searchNotes = async (query) => {
  const response = await api.get(
    `/notes/search?query=${encodeURIComponent(query)}`
  );
  return response.data;
};

export default api;
