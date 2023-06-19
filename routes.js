const {loginHandler, registerHandler, getProfileHandler, updatePasswordHandler, getMovieHandler, getLatestMovieHandler, getScheduleHandler, getSeatingHandler, bookSeatingHandler, cancelSeatingBookingHandler, helloworld} = require("./handler");

const routes = [

    {
        method: "GET",
        path: "/",
        handler: helloworld
    },
    {
        method: "POST",
        path: "/login",
        handler: loginHandler,
    },
    {
        method: "POST",
        path: "/register",
        handler: registerHandler,
    },
    {
        method: "GET",
        path: "/profile",
        handler: getProfileHandler,
    },
    {
        method: "PUT",
        path: "/profile/update-password",
        handler: updatePasswordHandler,
    },
    {
        method: "GET",
        path: "/movie/{id}",
        handler: getMovieHandler,
    },
    {
        method: "GET",
        path: "/latest-movie",
        handler: getLatestMovieHandler,

    },
    {
        method: "GET",
        path: "/schedule/{id}",
        handler: getScheduleHandler,
      },
      {
        method: "GET",
        path: "/seating/{id}",
        handler: getSeatingHandler,
      },
      {
        method: "POST",
        path: "/seating/book/{id}",
        handler: bookSeatingHandler,
      },
      {
        method: "PUT",
        path: "/seating/{id}/cancel-booking",
        handler: cancelSeatingBookingHandler,
      },
];



module.exports = routes;
