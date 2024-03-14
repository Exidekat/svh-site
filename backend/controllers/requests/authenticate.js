module.exports = async (req, res, pool) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const query = 'SELECT authtype FROM users WHERE email = $1;';
        console.log(email);
        const { rows } = await pool.query(query, [email]);
        console.error(rows);

        if (rows.length > 0) {
            res.send({ authtype: rows[0].authtype });
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send({ error: 'Database query error' });
    }
}