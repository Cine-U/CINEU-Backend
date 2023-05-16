const {loginHandler, registerHandler} = require("./handler");

const routes = [
    {
        method: "POST",
        path: "/login",
        handler: loginHandler,
    },
    {
        method: "POST",
        path: "/register",
        handler: registerHandler,
    }
];

// Buat homepage
server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        const [rows, fields] = await pool.query('SELECT * FROM movies ORDER BY release_date DESC LIMIT 6');
        return h.view('index', { movies: rows });
    }
});

// Buat movie page
server.route({
    method: 'GET',
    path: '/movie/{id}',
    handler: async (request, h) => {
        const movieId = request.params.id;
        const [rows, fields] = await pool.query('SELECT * FROM movies WHERE id = ?', [movieId]);
        if (rows.length === 0) {
            return h.response('Movie not found').code(404);
        }
        const movie = rows[0];
        return h.view('movie', { movie });
    }
});

module.exports = routes;

/asdf