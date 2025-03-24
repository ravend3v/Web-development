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
let htmlString = '';
todoList.forEach((item) => {
    htmlString += `
        <li>
            <input type="checkbox" id="task${item.id}" ${item.completed ? 'checked' : ''}>
            <label for="task${item.id}">${item.task}</label>
        </li>
    `;
});

const ulElement = document.querySelector('#todo-list');
ulElement.insertAdjacentHTML('beforeend', htmlString);

