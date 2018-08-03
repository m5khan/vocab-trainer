
module.exports.auth = function auth(req, res, next) {
    if (req.session && req.session.loggedin == true) {
        return next();
    } else {
        res.status('401').send('unauthorized');
    }
}


//todo: create a middleware that checks if email address already exists in database 