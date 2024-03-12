const express = require('express');
const { Pool, Client } = require('pg');

//Import configuration object
const CONFIG = require('./config.json');

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON bodies

//Configuration paramaters from ./config.json
const DATABASE_CONFIG = CONFIG.database;
const SERVER_CONFIG = CONFIG.server;

const DATABASE_CREATION_SCRIPT = require('./config.json').database_creation_script;

const handleConnectionError = require('./src/server/errors/handleConnectionError');
const { authenticate } = require('./src/server/requests/index');

const pool = new Pool(DATABASE_CONFIG);

const initServer = () => {
    // Endpoint to authenticate user
    app.post('/authenticate', (req, res) => authenticate(req, res, pool));

    app.listen(SERVER_CONFIG.port, () => {
        console.log(`Server running on http://localhost:${SERVER_CONFIG.port}`);
    });
}

pool.connect().catch((e) => {
    handleConnectionError(e, DATABASE_CONFIG, DATABASE_CREATION_SCRIPT, Client, () => {
        pool.connect();
    });
});

pool.on('connect', () => {
    console.log('Connected to database');
    initServer();
});