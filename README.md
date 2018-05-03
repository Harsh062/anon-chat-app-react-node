# anon-chat-app-react-node
A simple anonymous chat application built using ReactJs, NodeJs and SocketIo.
Front End folder Structure for the React App is generated via create-react-app and the code is placed in the client folder.
Back end nodeJs server is running on port 5000.

## Setup
1. Clone the repository
2. In the root folder of the project, run `$ npm install` to install the dependencies for the back-end
3. In the client folder of the project, run `$ npm install` to install the dependencies for the front end React application generated through create-react-app.
4. Spin of the back-end server by running `$ node server.js` in the root folder of the project. This will start the nodeJs server on port 5000
5. Spin off the react application by running `$npm start` in the client folder of the project, This will start the react application on port 3000.
6. Open `http://localhost: 3000` in your browser to view the Chat app UI and click on join to join the Chat App feed. Similarly open `http://localhost: 3000` in a new tab to communicate as a different user. The different users are identified by a different colors of their chat texts. The color is generated randomly for every user.
