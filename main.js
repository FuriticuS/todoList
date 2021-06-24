let arrOfTasks = [];
const textTask = document.getElementById('input'),
    taskContainer = document.getElementById('task-list');

// отображение при загрузке
window.addEventListener('load', init);

taskContainer.addEventListener('click', ({target}) => {
    const targetAttr = target.dataset.btn;

    switch (targetAttr) {
        case 'delete':
            deleteTask(target);
            break;
        case 'completed':
            completedTask(target);
            break;
        case 'edit':
            editTask(target);
            break;
    }
})

// function delete one task
function deleteTask(target) {
    const elemDelete = target.closest('li');
    if (elemDelete.classList.contains('task')) {
        elemDelete.remove();
    }
}

// function completed click checkbox
function completedTask(target) {
    const elemCheck = target.closest('li');
    if (target.checked) {
        elemCheck.classList.add('completed');
        elemCheck.style.background = '#e5f4ff';
    } else {
        elemCheck.style.background = 'none';
        elemCheck.classList.remove('completed');
    }
}

// function edit
function editTask(target) {
    const elemValue = target.closest('li').querySelector('.text');

    textTask.value != '' ? elemValue.textContent = textTask.value : elemValue.textContent;
}

// функция инициализации
function init() {
    // return array of tasks or []
    arrOfTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(arrOfTasks);
}

// вывод task из input через фрагмент разметки or empty array
function renderTasks(textTask = []) {
    taskContainer.append(createTasksFragment(textTask));
}

// функция создания фрагмента элементов
function createTasksFragment(textTask) {
    const fragment = document.createDocumentFragment();

    textTask.forEach(textTask => {
        fragment.append(createTaskElement(textTask))
    });

    return fragment;
}

// функция создания элемента
function createTaskElement({id, body, completed}) {
    const li = document.createElement('li');

    // проверка на completed - true/false
    if (completed) {
        li.classList.add('completed');
    }
    li.classList.add('task');

    // идентифицировать (присвоить id)
    li.id = id;

    // добавление текста textTask.body
    const p = document.createElement('p');
    p.classList.add('text');
    // проверка на пустой текст
    body !== '' ? p.textContent = body : p.textContent = 'введите задачу';


    // добавление чекбокса
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.dataset.btn = 'completed'

    if (completed) {
        check.checked = true;
        li.style.background = '#e5f4ff';
    }

    // button delete task
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.dataset.btn = 'delete'

    // button edit task
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Изменить';
    editBtn.dataset.btn = 'edit';

    // создание p с check и li добавляя в него элементов
    p.prepend(check);
    li.append(p, deleteBtn, editBtn);

    return li;
}

// функция добавления task
textTask.addEventListener('keypress', function (e) {
    if (e.key !== 'Enter') {
        return
    }
    renderNewTask(this.value, this);
})

function renderNewTask(value, input) {
    const isValidInput = validateInput(value, input);
    if (!isValidInput) {
        return;
    }

    const newTask = createNewTask(value);

    arrOfTasks.unshift(newTask);

    // add task on page
    taskContainer.insertAdjacentElement('afterbegin', createTaskElement(newTask));
}

function validateInput(value, input) {
    if (!value.trim().length) {
        input.placeholder = 'Введите задание';
        input.style.cssText = `border: 2px solid red`;
        return false;
    } else {
        input.style.cssText = `border: 2px solid black`;
        return true;
    }
}

function createNewTask(body) {
    return {
        id: Math.random() * 10,
        body,
        completed: false
    };
}

// функция уделения всех task из списка
if (!taskContainer.firstElementChild) {
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Удалить все задачи';
    document.querySelector('body').append(deleteBtn);

    deleteBtn.addEventListener('click', function () {
        while (taskContainer.firstElementChild) {
            taskContainer.firstElementChild.remove();
        }

        deleteBtn.remove();
    });
}

window.addEventListener('unload', function () {
    //convert to JSON format
    let jsonArr = JSON.stringify(arrOfTasks);
    return localStorage.setItem('tasks', jsonArr);
})
