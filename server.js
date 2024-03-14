const express = require('express');
const { Pool, Client } = require('pg');

//Import configuration object
const CONFIG = require('./config.json');

const inDevMode = process.argv[2] === 'dev';
const cors = require('cors');
const app = express();

app.use(cors());

if (!inDevMode) {
    app.use(express.static('public'));
}

app.use(express.json()); // Middleware to parse JSON bodies

//Configuration paramaters from ./config.json
const DATABASE_CONFIG = CONFIG.database;
const SERVER_CONFIG = CONFIG.server;
const SERVER_PORT = inDevMode ? SERVER_CONFIG.devPort : SERVER_CONFIG.port;

const DATABASE_CREATION_SCRIPT = require('./config.json').database_creation_script;

const handleConnectionError = require('./backend/controllers/errors/handleConnectionError');
const { authenticate } = require('./backend/controllers/requests/index');

const pool = new Pool(DATABASE_CONFIG);

const initServer = () => {
    // Endpoint to authenticate user
    app.post('/authenticate', (req, res) => authenticate(req, res, pool));

    app.listen(SERVER_PORT, () => {
        console.log(`Server running on http://localhost:${SERVER_PORT}`);
    });
}

pool.connect().then(() => {
    console.log('Initializing server');
    initServer();
}).catch((e) => {
    handleConnectionError(e, DATABASE_CONFIG, DATABASE_CREATION_SCRIPT, Client, pool, () => {
        console.log('Connected to database');
        initServer();
    });
});