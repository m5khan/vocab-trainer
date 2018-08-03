var express = require('express');
var router = express.Router();
var dbConnector = require('../core/DBConnector');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });
    res.sendFile('public/index.html', function (err) {
        if (err) {
            throw err;
        }
    });
});

router.post('/login', function (req, res) {
    var body = req.body;
    dbConnector.User.auth(body, function (err, result) {
        if (err) throw err;
        if (!result) { 
            res.status(401).send('incorrect username or password');
        }
        else if (result.email == body.email && result.pwd == body.pass) {
            req.session.loggedin = true;
            req.session.email = result.email;
            req.session.userid = result._id;
            res.status(200).send('success');
        }
        else { 
            res.status(500).send('restricted');
        }
    });

});

module.exports = router;