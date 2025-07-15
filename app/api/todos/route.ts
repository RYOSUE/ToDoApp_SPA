import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// READ
export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM todos');
        return Response.json(rows);
    } catch (err) {
        return Response.json({ error: String(err) }, {status: 500 });
    }
}

// CREATE
export async function POST(request: Request) {
    const {title, content, deadline, completed} = await request.json();
    try {
        await pool.query(
            'INSERT INTO todos (title,content, deadline, completed) VALUES (?,?,?,?)',
            [title, content, deadline, completed]
        );
        return Response.json({ message: 'ToDo item created successfully' }, { status: 201 });
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
    }
}

// UPDATE
export async function PUT(request: Request) {
    const {id, title, content, deadline, completed} = await request.json();
    try {
        await pool.query(
            'UPDATE todos SET title=?, content=?, deadline=?, completed=? WHERE id=?',
            [title, content, deadline, completed, id]
        );
        return Response.json({ message: 'ToDo item updated successfully' });
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(request: Request) {
    const {id} = await request.json();
    try{
        await pool.query('DELETE FROM todos WHERE id=?', [id]);
        return Response.json({ message: 'ToDo item deleted successfully' });
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
    }
}