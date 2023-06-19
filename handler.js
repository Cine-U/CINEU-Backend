const db = require('./database');
const { nanoid } = require("nanoid");

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  if (!email || !password) {
    return h.response({
      status: 'fail',
      message: 'Email and Password are required',
    }).code(400);
  }

  try {
    const query = 'SELECT * FROM customer WHERE cust_email = ?';
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Invalid email or password',
      }).code(401);
    }

    const user = rows[0];
    const isPasswordCorrect = password === user.password;

    if (!isPasswordCorrect) {
      return h.response({
        status: 'fail',
        message: 'Invalid email or password',
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        customer_id: user.customer_id
      }
    }).code(200);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};


const registerHandler = async (request, h) => {
  const {
    email,
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    birthday,
    phoneNumber,
    street,
    city,
    province,
    postalcode,
    paymentMethod,
    cardNumber,
    expiryDate
  } = request.payload;

  const checkUserQuery = 'SELECT * FROM customer WHERE cust_email = ?';

  try {
    const [existingUser] = await db.query(checkUserQuery, [email]);

    if (existingUser.length > 0) {
      return h.response({
        status: 'fail',
        message: 'User with this email already exists',
      }).code(400);
    } else if (password !== confirmPassword) {
      return h.response({
        status: 'fail',
        message: "Password doesn't match",
      }).code(400);
    }

    const id = nanoid(16);
    const insertUserQuery = `
      INSERT INTO customer
        (customer_id, cust_email, username, password, firstName, lastName, birthday, phoneNumber, street, city, province, postalcode, paymentMethod, cardNumber, expiryDate)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertUserQuery, [
      id,
      email,
      username,
      password,
      firstName,
      lastName,
      birthday,
      phoneNumber,
      street,
      city,
      province,
      postalcode,
      paymentMethod,
      cardNumber,
      expiryDate
    ]);

    return h.response({
      status: 'success',
      message: 'User created successfully',
    }).code(201);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};


const getProfileHandler = async (request, h) => {
  const id = request.params.id;
  const query = 'SELECT * FROM customer WHERE customer_id = ?';

  try {
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'User not found',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: {
        ...rows[0],
      },
    }).code(200);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

const updatePasswordHandler = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const query = 'SELECT * FROM customer WHERE cust_email = ?';
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Invalid email',
      }).code(401);
    } else {
      const updateQuery = 'UPDATE customer SET password = ? WHERE cust_email = ?';
      await db.query(updateQuery, [password, email]);

      return h.response({
        status: 'success',
        message: 'Password updated',
      }).code(200);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

const getMovieHandler = async (request, h) => {
  const movie_id = request.params.id;
  const query = 'SELECT * FROM movies where movie_id = ?';

  try {
    const [rows] = await db.query(query, [movie_id]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Movie not found',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: {
        ...rows[0],
      },
    }).code(200);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

//get 6 latest movies for homepage
const getLatestMovieHandler = async (request, h) => {
  const query = 'SELECT * FROM movie ORDER BY release_date DESC LIMIT 6';

  try {
    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Movies not found',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

const getScheduleHandler = async (request, h) => {
  const { movie_id, cinema_id } = request.payload;
  const query = 'SELECT * FROM movieSchedule WHERE movie_id = ? AND cinema_id = ?';

  try {
    const [rows] = await db.query(query, [movie_id, cinema_id]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Movie schedule not found',
      }).code(404);
    }

    return h.response({
      status: 'success',
      data: rows,
    }).code(200);
  } catch (error) {
    console.error('Error occurred:', error);
    return h.response({
      status: 'error',
      message: 'Internal server error',
    }).code(500);
  }
};

    
//TODO: fix variable
const getSeatingHandler = async (request, h) => {
  const { schedule_id } = request.params;
  const query = 'SELECT * FROM seating INNER JOIN theatreSeating ts ON seating.theatreSeating_id = ts.theatreSeating_id INNER JOIN movieSchedule ms ON ms.theatre_id = ts.theatre_id WHERE ms.schedule_id = ?';

  const [rows] = await db.query(query, [schedule_id]);

  if (rows.length === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Seating information not found'
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      seating: rows
    }
  });
  return response;
};


// TODO: check again
const bookSeatingHandler = async (request, h) => {
  const seat_id = request.params.id;
  const query = 'SELECT status FROM seating WHERE seat_id = ?';

  const [rows] = await db.query(query, seat_id);

  if (rows.length === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Seat cannot be booked',
    });
    response.code(404);
    return response;
  }

  const seatStatus = rows[0].status;

  if (seatStatus === 1) {
    const response = h.response({
      status: 'fail',
      message: 'Seat is already booked',
    });
    response.code(400);
    return response;
  }

  const updateQuery = 'UPDATE seating SET status = 1 WHERE seat_id = ?';
  await db.query(updateQuery, seat_id);

  const response = h.response({
    status: 'success',
    message: 'Seat booked successfully',
  });
  response.code(200);
  return response;
};


// TODO: check again
const cancelSeatingBookingHandler = async (request, h) => {
  const seat_id = request.params.id;
  const statusQuery = 'SELECT status FROM seating WHERE seat_id = ?';

  const [statusRows] = await db.query(statusQuery, seat_id);

  if (statusRows.length === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Seat does not exist',
    });
    response.code(404);
    return response;
  }

  const currentStatus = statusRows[0].status;

  if (currentStatus === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Seat is already available',
    });
    response.code(400);
    return response;
  }

  const cancelQuery = 'UPDATE seating SET status = 0 WHERE seat_id = ?';
  await db.query(cancelQuery, seat_id);

  const response = h.response({
    status: 'success',
    message: 'Seat booking canceled successfully',
  });
  response.code(200);
  return response;
};


module.exports = {loginHandler, registerHandler, getProfileHandler, updatePasswordHandler, getMovieHandler, getLatestMovieHandler, getScheduleHandler, getSeatingHandler, bookSeatingHandler, cancelSeatingBookingHandler};
