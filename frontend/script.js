const btnAddTaskEl = document.getElementById("add-task")
const btnLoadTasksEl = document.getElementById("load-tasks")

const inputTaskTitleEl = document.getElementById("task-title")
const inputTaskDescEl = document.getElementById("task-desc")

const taskListEl = document.getElementById("tasks")

function createElement(tag, className, textContent,) {
    const el = document.createElement(tag)
    if (className) {
        el.classList.add(className)
    }
    if (textContent) {
        el.textContent = textContent
    }
    return el
}

async function addTask() {
    try {
        const title = inputTaskTitleEl.value.trim()
        const desc = inputTaskDescEl.value.trim()

        if (title === "" || desc == "") {
            alert("Заполните все поля!")
            return
        }

        const task = {
            "title": title,
            "desc": desc
        }

        const task_json = JSON.stringify(task)

        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: task_json
        })

        if (response.ok){
            const result = await response.json()
            console.log(result.message)

            inputTaskTitleEl.value = ""
            inputTaskDescEl.value = ""

            await loadTasks()
        }
        else {
            console.log(`Ошибка запроса: ${response.status}`);
            alert(`Ошибка сервера: ${response.status}`)
        }
    }
    catch (error) {
        console.error(error);
        alert("Не удалось добавить задачу")
    }
}

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks")

        if (!response.ok) {
            console.log(`Ошибка, статус: ${response.status}`);
            return
        }

        const result = await response.json()
        
        taskListEl.innerHTML = ""

        if (result.length === 0) {
            taskListEl.textContent = "Задач пока нет"
            return
        }

        for (const item of result) {
            const title = item.title
            const desc = item.desc

            const li = document.createElement("li")
            li.classList.add("task")

            const h2 = document.createElement("h2")
            h2.classList.add("task__title")
            h2.textContent = title

            const p = document.createElement("p")
            p.classList.add("task__desc")
            p.textContent = desc

            const btnDelete = document.createElement("button")
            btnDelete.textContent = "Удалить"
            btnDelete.classList.add("task__btn-delete")
            btnDelete.addEventListener("click", async () => 
                {
                    try {
                        const response = await fetch(`/api/tasks/${item.id}`, {
                            method: "DELETE"
                        });

                        if (!response.ok) {
                            throw new Error(`Ошибка HTTP: ${response.status}`)
                        }
                    }
                    catch (error) {
                        console.error(error);
                        alert("Ошибка удаления!");
                        return;
                    }
                    
                    await loadTasks()
                }
            )
            
            const btnEdit = document.createElement("button")
            btnEdit.textContent = "Изменить"
            btnEdit.classList.add("task__btn-edit")
            btnEdit.addEventListener("click", async () => {
                const inputTitleEdit = document.createElement("input")
                inputTitleEdit.classList.add("task-form__input")
                inputTitleEdit.value = title

                const inputDescEdit = document.createElement("textarea")
                inputDescEdit.classList.add("task-form__input")
                inputDescEdit.value = desc

                h2.replaceWith(inputTitleEdit)
                p.replaceWith(inputDescEdit)

                btnEdit.disabled = true

                const btnSave = createElement("button", "task__btn-save", "Сохранить")
                const btnCancel = createElement("button", "task__btn-cancel", "Отмена")
                btnCancel.addEventListener("click", () => {
                    btnEdit.disabled = false
                    inputTitleEdit.replaceWith(h2)
                    inputDescEdit.replaceWith(p)
                    btnSave.remove()
                    btnCancel.remove()
                })

                li.append(btnSave, btnCancel)
            })

            li.append(h2, p, btnDelete, btnEdit)

            taskListEl.appendChild(li)
        }
    }
    catch (error) {
        taskListEl.textContent = "Не удалось загрузить задачи"
        console.error(error);
    }
}


btnAddTaskEl.addEventListener("click", addTask)
btnLoadTasksEl.addEventListener("click", loadTasks)