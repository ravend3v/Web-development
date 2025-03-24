// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

// add your code here
const ulElement = document.querySelector('#todo-list');

todoList.forEach((item) => {
    // Create the <li> element
    const liElement = document.createElement('li');

    // Create the <input> element
    const inputElement = document.createElement('input');
    inputElement.type = 'checkbox';
    inputElement.id = `task${item.id}`;
    inputElement.checked = item.completed;

    // Create the <label> element
    const labelElement = document.createElement('label');
    labelElement.htmlFor = `task${item.id}`;
    labelElement.textContent = item.task;

    // Append the <input> and <label> elements to the <li> element
    liElement.appendChild(inputElement);
    liElement.appendChild(labelElement);

    // Append the <li> element to the <ul> element
    ulElement.appendChild(liElement);
});
