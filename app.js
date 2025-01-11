import {
  saveTodosIntoLocalStorage,
  getTodosFromLocalStorage,
  getDateRepresentation,
} from "./utils.js";

const addTodoInputEl = document.querySelector("[data-todo-field]");
const addTodoBtnEl = document.querySelector("[data-todo-add-button]");
const todosListEl = document.querySelector("[data-todo-list]");
const todoTemplateEl = document.querySelector("[data-todo-template]");
const searchTodoEl = document.querySelector("[data-search-todo-input]");
const todoCounterEl = document.querySelector("[data-todo-counter]");

let todoList = getTodosFromLocalStorage();
let filteredTodosList = [];
let count = 0;

addTodoBtnEl.addEventListener("click", () => {
  if (addTodoInputEl.value.trim()) {
    const newTodo = {
      id: Date.now(),
      text: addTodoInputEl.value.trim(),
      completed: false,
      createdAt: getDateRepresentation(new Date()),
    };
    todoList.push(newTodo);
    addTodoInputEl.value = "";
    saveTodosIntoLocalStorage(todoList);
    renderTodos();
  }
});

addTodoInputEl.addEventListener("input", () => {
  if (searchTodoEl.value.trim()) {
    searchTodoEl.value = "";
    renderTodos();
  }
});

searchTodoEl.addEventListener("input", (event) => {
  const searchValue = event.target.value.trim();
  filterAndRenderFilteredTodos(searchValue);
});

const filterAndRenderFilteredTodos = (searchValue) => {
  filteredTodosList = todoList.filter((t) => {
    return t.text.includes(searchValue);
  });
  renderFilteredTodos();
};

const createTodoLayout = (todo) => {
  const todoEl = document.importNode(todoTemplateEl.content, true);

  const checkbox = todoEl.querySelector("[data-todo-checkbox]");
  checkbox.checked = todo.completed;

  const todoText = todoEl.querySelector("[data-todo-text]");
  todoText.textContent = todo.text;

  const todoCreatedDate = todoEl.querySelector("[data-todo-date]");
  todoCreatedDate.textContent = todo.createdAt;

  const rmTodoBtn = todoEl.querySelector("[data-remove-todo-btn]");
  rmTodoBtn.disabled = !todo.completed;

  checkbox.addEventListener("change", (event) => {
    todoList = todoList.map((t) => {
      if (t.id === todo.id) {
        t.completed = event.target.checked;

        if (t.completed) {
          ++count;
        } else if (!t.completed) {
          --count;
        }
      }
      return t;
    });
    saveTodosIntoLocalStorage(todoList);

    if (searchTodoEl.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoEl.value.trim());
    } else {
      renderTodos();
    }
  });

  rmTodoBtn.addEventListener("click", () => {
    todoList = todoList.filter((t) => {
      if (t.id !== todo.id) {
        return t;
      } else if (t.id === todo.id) {
        count--;
      }
    });
    saveTodosIntoLocalStorage(todoList);

    if (searchTodoEl.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoEl.value.trim());
    } else {
      renderTodos();
    }
  });

  return todoEl;
};

const renderFilteredTodos = () => {
  todosListEl.innerHTML = ``;

  if (filteredTodosList.length === 0) {
    todosListEl.innerHTML = `<h3 class="zero-todos">no todos found</h3>`;
    return;
  }

  filteredTodosList.forEach((todo) => {
    const todoEl = createTodoLayout(todo);
    todosListEl.append(todoEl);
  });
};

const renderTodos = () => {
  todosListEl.innerHTML = ``;
  if (count < 0) {
    count = 0;
    todoCounterEl.innerHTML = `Задач выполнено: 0`;
  } else {
    todoCounterEl.innerHTML = `Задач выполнено: ${count}`;
  }

  if (todoList.length === 0) {
    todosListEl.innerHTML = `<h3 class="zero-todos">no todos</h3>`;
    return;
  }

  todoList.forEach((todo) => {
    const todoEl = createTodoLayout(todo);
    todosListEl.append(todoEl);
  });
};

renderTodos();
