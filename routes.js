const {loginHandler, registerHandler, getProfileHandler, updatePasswordHandler, getMovieHandler, getLatestMovieHandler} = require("./handler");

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
    },
    {
        method: "GET",
        path: "/profile",
        handler: getProfileHandler,
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
];



module.exports = routes;
