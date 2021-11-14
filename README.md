# Another one of my test tasks for frontend developers =)

I was working on a small To-Do list application.
A detailed version of the project can be seen in [editor](https://codesandbox.io/s/distracted-yalow-t5dpj?file=/src/App.tsx).
____
### The project was deployed with Create-React-App.

Use `npm install` to install dependencies and `npm start` 
to deploy the project locally.
____

## In this project I have added :

- [X] Priorities  

  The user wants to prioritize tasks, 
to see the most important tasks at the top of the list.

  Add the ability to change the order of tasks using drag'n'drop 
  (I used [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd))
  
- [X] Sync
  Add synchronization of tasks between neighboring tabs - 
adding or editing a task in one tab should appear in a second open tab of the same browser
  ([storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event))
  
- [X] immutability
  changed the `todoItemsReducer` code to [ImmerJS](https://immerjs.github.io/immer/)


____
##  The technical stack

- TypeScript
- React
- Material-UI
- Framer Motion
