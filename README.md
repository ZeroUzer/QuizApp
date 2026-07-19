# QuizApp

Платформа для создания и прохождения квизов.

---

## Стек

- Python / Django / DRF / JWT / SQLite
- React / Vite / React Router / Axios

---

## Возможности

- Регистрация и вход
- Создание, редактирование, удаление квизов
- Добавление вопросов и ответов
- Прохождение квизов с таймером
- Импорт из JSON, CSV, TXT

---

## Запуск

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
Структура
text
backend/
  users/          # Пользователи, JWT
  quizzes/        # Квизы, вопросы, ответы
  rooms/          # Игровые сессии

frontend/
  pages/          # Home, Login, Dashboard, QuizEditor, QuizPlay
  components/     # UI компоненты
  services/       # API запросы
API
Метод	Эндпоинт	Описание
POST	/api/users/register/	Регистрация
POST	/api/users/login/	Вход
GET	/api/quizzes/	Список квизов
POST	/api/quizzes/	Создать квиз
DELETE	/api/quizzes/{id}/	Удалить
POST	/api/questions/	Добавить вопрос
POST	/api/answers/	Добавить ответ
Автор
ZeroUzer