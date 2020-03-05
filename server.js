// server.js -- A simple Express.js web server for serving a React.js app

import path from 'path';
import express from 'express';
const app = express();
app.use(express.static(path.join(__dirname, 'client', 'build')));

const PORT = process.env.HTTP_PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}.`);
});