const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

handleConnectionError = (e, DATABASE_CONFIG, DATABASE_CREATION_SCRIPT, Client, pool, successFunction) => {
    const { database } = DATABASE_CONFIG;
    if (e.message === `database "${database}" does not exist`){
        readline.question(`Database "${database}" does not exist, create database "${database}"? Type YES to create, type NO to cancel: `, (answer) => {
            if (answer === 'YES'){
                console.log('Creating database');

                const { user, host, password, port } = DATABASE_CONFIG;
                const adminClient = new Client({user, host, password, port})

                adminClient.connect();
                adminClient.query(DATABASE_CREATION_SCRIPT.db).then(async () => {
                    console.log('Successfully created database');

                    try {
                        await pool.connect();
                        
                        for (let i in DATABASE_CREATION_SCRIPT.tables){
                            const table = DATABASE_CREATION_SCRIPT.tables[i];

                            await pool.query(table.script);

                            console.log(`Successfully created table ${table.name}`);
                        }

                        successFunction();
                    }
                    catch(e){
                        console.error('Error creating tables: ' + e);
                    }

                }).catch((e) => {
                    console.error('Failed to create database');
                    console.error(e);
                });
            }
            else {
                console.log('Exiting program');
                process.exit(0);
            }
        })
    }
    else {
        console.error('Unexpected error connecting to database');
        console.error(e);
    }
}

module.exports = handleConnectionError;