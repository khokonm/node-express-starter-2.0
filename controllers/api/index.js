// could automate this importer as well, 
// but i'm actually a bit too lazy to do that.
// also don't think this will be a huge importer
// as this will only import the primary ones
const authController = require("./auth");
const businessController = require("./business");

module.exports = {
    authController,
    businessController,
}