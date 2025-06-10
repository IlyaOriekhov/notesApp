import React, { useState, useEffect } from "react";

const NoteForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState({});

  // Заповнення форми даними для редагування
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
      });
    } else {
      setFormData({ title: "", content: "" });
    }
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Заголовок обов'язковий";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Заголовок повинен містити принаймні 3 символи";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Текст нотатки обов'язковий";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Текст нотатки повинен містити принаймні 10 символів";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищення помилки при введенні
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim(),
      });

      if (!isEditing) {
        setFormData({ title: "", content: "" });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", content: "" });
    setErrors({});
    onCancel();
  };

  return (
    <div className="note-form-container">
      <h2>{isEditing ? "Редагувати нотатку" : "Створити нову нотатку"}</h2>

      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Заголовок:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введіть заголовок нотатки..."
            className={errors.title ? "error" : ""}
            maxLength={100}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
          <div className="char-count">{formData.title.length}/100</div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Текст нотатки:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Введіть текст нотатки..."
            rows={6}
            className={errors.content ? "error" : ""}
            maxLength={1000}
          />
          {errors.content && (
            <span className="error-text">{errors.content}</span>
          )}
          <div className="char-count">{formData.content.length}/1000</div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            {isEditing ? "Зберегти зміни" : "Створити нотатку"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Скасувати
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
