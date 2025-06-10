import React, { useState } from "react";

const NoteItem = ({ note, onEdit, onDelete, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "щойно";
    if (diffInMinutes < 60) return `${diffInMinutes} хв. тому`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} год. тому`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн. тому`;

    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const isLongContent = note.content.length > 150;
  const displayContent = isExpanded ? note.content : truncateText(note.content);

  return (
    <div className="note-item">
      <div className="note-header">
        <h4 className="note-title">{highlightText(note.title, searchQuery)}</h4>
        <div className="note-actions">
          <button
            onClick={() => onEdit(note)}
            className="btn btn-edit"
            title="Редагувати нотатку"
          >
            Редагувати
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="btn btn-delete"
            title="Видалити нотатку"
          >
            Видалити
          </button>
        </div>
      </div>

      <div className="note-content">
        <p>{highlightText(displayContent, searchQuery)}</p>
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-expand"
          >
            {isExpanded ? "Згорнути" : "Розгорнути"}
          </button>
        )}
      </div>

      <div className="note-footer">
        <div className="note-dates">
          <span className="created-date">
            Створено: {formatDate(note.createdAt)}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span className="updated-date">
              Оновлено: {formatDate(note.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
