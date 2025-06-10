import React, { useState } from "react";
import NoteItem from "./NoteItem";

const NotesList = ({ notes, onEdit, onDelete, searchQuery }) => {
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedNotes = [...notes].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortBy === "title") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕";
    return sortOrder === "asc" ? "⬆" : "⬇";
  };

  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <div className="no-notes">
          {searchQuery ? (
            <>
              <h3>Нічого не знайдено</h3>
              <p>За запитом "{searchQuery}" нотаток не знайдено.</p>
              <p>Спробуйте змінити пошуковий запит.</p>
            </>
          ) : (
            <>
              <h3>Нотаток поки немає</h3>
              <p>Створіть свою першу нотатку, використовуючи форму вище!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <div className="notes-header">
        <h3>
          {searchQuery ? (
            <>Результати пошуку ({sortedNotes.length})</>
          ) : (
            <>Всі нотатки ({notes.length})</>
          )}
        </h3>

        <div className="sort-controls">
          <span>Сортувати за:</span>
          <button
            onClick={() => handleSortChange("title")}
            className={`sort-btn ${sortBy === "title" ? "active" : ""}`}
          >
            Назвою {getSortIcon("title")}
          </button>
          <button
            onClick={() => handleSortChange("createdAt")}
            className={`sort-btn ${sortBy === "createdAt" ? "active" : ""}`}
          >
            Створенням {getSortIcon("createdAt")}
          </button>
          <button
            onClick={() => handleSortChange("updatedAt")}
            className={`sort-btn ${sortBy === "updatedAt" ? "active" : ""}`}
          >
            Оновленням {getSortIcon("updatedAt")}
          </button>
        </div>
      </div>

      <div className="notes-grid">
        {sortedNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesList;
