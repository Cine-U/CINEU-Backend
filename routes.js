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

module.exports = routes;
