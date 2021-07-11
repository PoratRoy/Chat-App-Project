# Chat-App-Project

### Introduction
This is a full-stack chat application that can be up and running with just a few steps. 
Its frontend is built with Material UI running on top of React. 
The backend is built with Express.js and Node.js. Real-time message broadcasting is developed using Socket.IO.
___

### Features
This application provides users with the following features:

- Authentication using JWT Tokens
- A Private Chat functionality where users can chat with other users privately.
- Real-time updates to the user list, conversation list, and conversation messages.
___

### How to use
You can have this application up and running with just a few steps because it has both the frontend and the backend in a single repository. Follow the steps below to do so.

1. Clone this repo
2. Once you have the repo, you need to install its dependencies. 
So using a terminal, move into the root directory of the project and execute ```npm install``` to install the dependencies of the Node.js server 
and then run ```npm run client-install``` to install the dependencies of the frontend. 
The second command is a custom command that I wrote to simplify the installation process.
3. This application uses MongoDB as its Database. So make sure you have it installed. 
You can find detailed guides on how to do so [here](https://docs.mongodb.com/manual/administration/install-community/).
4. Finally, all you have to do is simply run ```npm run dev```. If this command fails, try installing the package concurrently globally by running npm install -g concurrently and then running the dev command.
5. The frontend of the application will be automatically opened in your web browser and you can test it away.
___

### Screenshots

