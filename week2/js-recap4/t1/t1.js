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

// Function to render the TODO list
function renderTodoList() {
  const todoContainer = document.querySelector('ul'); // Select the <ul> element
  todoContainer.replaceChildren(); // Clear existing content

  todoList.forEach((item) => {
    const todoItem = document.createElement('li');

    // Checkbox for marking completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.id = `todo-${item.id}`;
    checkbox.addEventListener('change', () => {
      item.completed = checkbox.checked;
      console.log(todoList); // Log updated array
    });

    // Label for the task
    const label = document.createElement('label');
    label.textContent = item.task;
    label.htmlFor = `todo-${item.id}`;

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
      todoList.splice(todoList.findIndex((todo) => todo.id === item.id), 1); // Remove item
      renderTodoList(); // Re-render the list
      console.log(todoList); // Log updated array
    });

    // Append elements to the todo item
    todoItem.append(checkbox, label, deleteButton);

    // Append todo item to the container
    todoContainer.append(todoItem);
  });
}

// Function to handle adding a new TODO item
function handleAddItem() {
  const dialog = document.querySelector('dialog');
  const inputField = dialog.querySelector('input');
  const form = dialog.querySelector('form');

  dialog.showModal(); // Show the dialog

  form.onsubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    const newTask = inputField.value.trim();
    if (newTask) {
      todoList.push({
        id: Date.now(), // Use timestamp for unique ID
        task: newTask,
        completed: false,
      });
      renderTodoList(); // Re-render the list
      console.log(todoList); // Log updated array
      dialog.close(); // Close the dialog
      inputField.value = ''; // Clear input field
    }
  };
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTodoList();

  // Add event listener for "Add Todo Item" button
  document.querySelector('.add-btn').addEventListener('click', handleAddItem);
});