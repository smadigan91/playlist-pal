# How to run without the backend

### Running using npm and vite
You'll need `node` for `npm` to work. If you don't have `node` already installed, visit the npm docs page to get an in depth explanation of how to install `node`, node version manager (`nvm`), and `npm`.
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

To run the frontend without spinning up the backend (not suggested) you need to do the following:
 1. do `npm install` to get all node packages defined in `package.json` used to build and run the app
 2. do `npm run build` to build the application and generate build files
 3. do `npm run dev` to start the frontend server and start the frontend app on `http://localhost:5173`