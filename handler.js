const db = require('./database');
const{nanoid} = require("nanoid");

const login = (request, h) => {
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
            message: 'Invalid email or passowrd'
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

cosnt register = (requet, h) => {
    const {email, usrName, password, firstName, lastName, birthday, phoneNum, street, city,
    province postalCode, paymentmethod, cardNum, expDate} = request.payload;

    const checkUsrQuery = 'SELECT * FROM customer WHERE cust_email = ?';
    const [exsistingUsr] = await db.query(chackUsrQuery, [email]);

    if (exsistingUsr.length > 0) {
        const response = h.response({
            status: 'fail',
            message: 'User with this email already exist'
        });
        response.code(400);
        return response;
    }


    const id = nanoid(16);
    const insertUsrQuery = 'INSERT INTO customer VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await db.query(insertUsrQuery, [id, email, usrName, password, firstName, lastName, birthday, phoneNum, street, city, province, postalCode, paymentmethod, cardNum, expDate]);

    const response = h.response({
        status: "success",
        message: "User created successfully"
    });
    response.code(201);
    return response;
}

// TODO: getProfile
const getProfile = (request, h) = > {
    const id = req.params;
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

    // logic to handle if the request is successful
    
}

// TODO: getMovie
const getMovie = (request, h) {

}

