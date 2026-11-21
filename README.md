# FastAPI Task API

Небольшой личный веб-проект для изучения REST API, серверной разработки на Python и взаимодействия frontend с backend.

Приложение позволяет создавать, просматривать и удалять задачи через веб-интерфейс. Данные сохраняются в JSON-файле.

## Технологии

- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Frontend:** HTML, CSS, JavaScript
- **Хранение данных:** JSON

## Возможности

- Создание задач с названием и описанием
- Просмотр списка задач
- Удаление задач по уникальному ID (UUID)
- Проверка вводимых данных
- Базовая обработка ошибок

## REST API

| Метод | Адрес | Описание |
|---|---|---|
| GET | `/api/tasks` | Получение задач |
| POST | `/api/tasks` | Создание задачи |
| DELETE | `/api/tasks/{task_id}` | Удаление задачи |

## Запуск проекта

**1. Клонировать репозиторий**

```powershell
git clone https://github.com/Denis-100/FastAPI-Task-API.git
cd FastAPI-Task-API
```

**2. Установить зависимости**

```powershell
python -m pip install -r requirements.txt
```

**3. Запустить сервер**

```powershell
python main.py
```

Открыть приложение: http://127.0.0.1:8000

Документация API: http://127.0.0.1:8000/docs
