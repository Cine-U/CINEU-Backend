const db = require('./database');
const{nanoid} = require("nanoid");

const loginHandler = async (request, h) => {
    const {email, password} = request.payload;

    if (!email || !password) {
        const response = h.response({
            status: 'fail',
            message: 'Email and Password are required',
        });
        response.code(400);
        return response;
    }

    const query = 'SELECT * FROM customer WHERE cust_email = ?';
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid email or password'
        });
        response.code(401);
        return response;
    }

    const user = rows[0];
    const isPasswordCorrect = (password === user.password); 

    if(!isPasswordCorrect) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid email or password',
        });
        response.code(401);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Logged in successfully'
    });
    response.code(200);
    return response;
}

const registerHandler = async (request, h) => {
    const {email, usrName, password, confirmPassword} = request.payload;

    const checkUsrQuery = 'SELECT * FROM customer WHERE cust_email = ?';
    const [exsistingUsr] = await db.query(chackUsrQuery, [email]);

    if (exsistingUsr.length > 0) {
        const response = h.response({
            status: 'fail',
            message: 'User with this email already exist'
        });
        response.code(400);
        return response;
    } else if (password != confirmPassword) {
        const response = h.response({
            status: 'fail',
            message: 'Password doesn\'t match'
        });
        response.code(200);
        return response;
    }

    const id = nanoid(16);
    const insertUsrQuery = 'INSERT INTO customer VALUES (?, ?, ?, ?)';
    await db.query(insertUsrQuery, [id, email, usrName, password]);

    const response = h.response({
        status: "success",
        message: "User created successfully"
    });
    response.code(201);
    return response;
}

const getProfileHandler = async (request, h) => {
    const id = request.params.id;
    const query = 'SELECT * FROM customers WHERE customer_id = ?';

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        const response = h.response({
            status:'fail',
            message:'User not found'
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            ...rows[0],
        }
    });
    response.code(200);
    return response;
}

// TODO: fix, dual variable
const updatePasswordHandler = async (request, h) => {
    const {email, password} = request.payload;
    const query = 'SELECT * FROM customer WHERE cust_email = ? AND password = ?';
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid email'
        });
        response.code(401);
        return response;
    } else {
        const query = 'UPDATE password FROM customer WHERE cust_email = ?';
        const [rows] = await db.query(query, password);

        const response = h.response({
            status: "success",
            message: "Password updated"
        });
        response.code(200);
        return response;
    }


}

const getMovieHandler = async (request, h) => {
    const movie_id = request.params.id;
    const query = 'SELECT * FROM movies where movie_id = ?';

    const [rows] = await db.query(query, [movie_id]);

    if (rows.length == 0) {
        const response = h.response({
            status: 'fail',
            message: 'Movie  not found'
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            ...rows[0],
        }
    });
    response.code(200);
        return response;
}

//get 6 latest movies for homepage
const getLatestMovieHandler = async (request, h) => {
    const query = 'SELECT * FROM movies ORDER BY release_date DESC LIMIT 6';
    const[rows] = await db.query(query);

    
    if (rows.length === 0) {
        const response = h.response({
            status: 'fail',
            message: 'Movies not found'
        });
        response.code(404);
        return response;

    }
    const response = h.response({
        status : "success",
        data: {
            ...rows[0],
        }    
    });
    response.code(200);
    return response;
}

// TODO: fix, dual variable
const getSchedule = async (request, h) => {
    const {movie_id, cinema_id} = request.payload;
    const query = 'SELECT * FROM movieSchedule WHERE movie_id = ? AND cinema_id = ?';

    const [rows] = await db.query(query, [movie_id, cinema_id]);

    if (rows.length == 0) {
        const response = h.response({
            status: 'fail',
            message: 'Movie schedule not found'
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: "success",
        data : {
            ...rows
        }
    });
    response.code(200);
    return response;
}
    
//TODO: fix variable
const getSeating = async (request, h) => {
    const id = request.params.id;
    const query = 'SELECT * FROM seating INNER JOIN theatreSeating ts ON s.theatreSeating_id = ts.theatreSeating_id INNER JOIN movieSchedule ms ON ms.theatre_id = ts.theatre_id WHERE ms.schedule_id = ?';

    const [rows] = await db.query(query, [id]);

    if (rows.length == 0) {
        const response = h.response({
            status: 'fail',
            message: 'Seating information not found'
        });
        response.code(404);
        return response;
    }

    // const response = h.response({
    //     status:"success",
    //     data: {
    //         ...rows
    //     }
    // });
    // response.code(200);
    // return response;
}

// TODO: Success response
const bookSeating = async (request, h) => {
    const seat_id = request.params.id;
    const query = 'UPDATE seating SET status = 1 WHERE seat_id = ?';

    const [rows] = await db.query(query, seat_id);

    if (rows.length == 0) {
        const response = h.response({
            status: 'fail',
            message: 'Seat cannot be booked'
        });
        response.code(404);
        return response;
    }
}

// TODO: success response
const cancelSeatingBooking = async (request, h) => {
    const seat_id = request.params.id;
    const query = 'UPDATE seating SET status = 0 WHERE seat_id = ?';

    const [rows] = await db.query(query, [id]);

    if (rows.length == 0) {
        const response = h.response({
            status: 'fail',
            message: 'Seat cannot be canceled'
        });
        response.code(404);
        return response;
    }

    // TODO: remove seating from query
}

//TODO: logout
// logout gk perlu dihandle pake REST API kyknya soalnya kan stateless

//TODO: search movie
// searchMovie bisa pake bisa pake getMoviebyID gk?

module.exports = {loginHandler, registerHandler, getProfileHandler, updatePasswordHandler, getMovieHandler, getLatestMovieHandler};
