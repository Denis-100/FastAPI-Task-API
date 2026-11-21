from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, ConfigDict
from uuid import uuid4
import os
import json
import uvicorn

FILE_NAME_DATA = "data.json"
app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend"), name="static")

class TaskCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1)
    desc: str = Field(min_length=1)

def insertDefaultData():
    data = [
            {
                "id": str(uuid4()),
                "title": "Изучить FastAPI",
                "desc": "Посмотреть видео урок"
            },
            {
                "id": str(uuid4()),
                "title": "Изучить REST API",
                "desc": "Посмотреть видео урок"
            },
            {
                "id": str(uuid4()),
                "title": "Практиковать REST API",
                "desc": "Написать функции взаимодействия"
            },
        ]
    if not os.path.exists(FILE_NAME_DATA):
        with open(FILE_NAME_DATA, "w", encoding="UTF-8") as file:
            json_str = json.dumps(data, ensure_ascii=False, indent=4)
            file.write(json_str)


@app.get("/")
def home():
    return FileResponse("frontend/index.html")


@app.get("/api/tasks")
def get_tasks():
    with open(FILE_NAME_DATA, "r", encoding="UTF-8") as file:
        data = json.load(file)
        return data


@app.post("/api/tasks")
def add_task(task: TaskCreate):
    with open(FILE_NAME_DATA, "r", encoding="UTF-8") as file:
        data = json.load(file)

    json_obj = {
        "id": str(uuid4()),
        "title": task.title,
        "desc": task.desc
    }
    data.append(json_obj)

    with open(FILE_NAME_DATA, "w", encoding="UTF-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    return {"message": "Задача добавлена!"}


@app.delete("/api/tasks/{task_id}")
def del_task(task_id: str):
    with open(FILE_NAME_DATA, "r", encoding="UTF-8") as file:
        data = json.load(file)

    for task in data:
        if task["id"] == task_id:
            data.remove(task)

            with open(FILE_NAME_DATA, "w", encoding="UTF-8") as file:
                json.dump(data, file, ensure_ascii=False, indent=4)

            return {"message": "Задача удалена"}

    raise HTTPException(status_code=404, detail="Задача не найдена")

if __name__ == "__main__":
    insertDefaultData()
    uvicorn.run(app, host="127.0.0.1", port=8000)