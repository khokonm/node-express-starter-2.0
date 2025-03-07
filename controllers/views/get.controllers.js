const asyncHandler = require('@utils/asyncHandler.util');

exports.Home = asyncHandler(async (req, res) => {
    res.render("index");
});

exports.Login = asyncHandler(async (req, res) => {
    res.render("auth/login");
});

exports.Register = asyncHandler(async (req, res) => {
    res.render("auth/register");
});

exports.ResetPassword = asyncHandler(async (req, res) => {
    res.render("auth/forgot-password");
});

exports.Terms = asyncHandler(async (req, res) => {
    res.render("terms");
});

exports.Privacy = asyncHandler(async (req, res) => {
    res.render("privacy");
});

exports.Dashboard = asyncHandler(async(req, res) => {
    res.render("dashboard");
});

exports.ApiPlayground = asyncHandler(async(req, res) => {
    res.render("api-playground");
});