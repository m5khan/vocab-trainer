var express = require('express');
var router = express.Router();
var dbConnector = require('../core/DBConnector');
var mw = require('../core/middleWare');


/* GET users listing. */
router.post('/',mw.auth , function (req, res) {
    var data = {};
    dbConnector.User.find(data, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/new',mw.auth , function (req, res) {
    var body = req.body;
    body.list = [];
    body.carry = [];
    dbConnector.User.add(body, function (err, result) {
        if (err) throw err;
        res.status(200).send('user created');
    });
});

var user1 = {
    name: "shoaib",
    email: "shoaib@vocab.com",
    pwd: "shoaib",
    list: [],
    carry : []  //carrying words; contains words objectIds
}


router.post('/new/createusershoaib', function (req, res) {
    dbConnector.User.add(user1, function (err, result) {
        if (err) throw err;
        res.status(200).send('admin user created');
    });
});

router.get('/isloggedin', mw.auth, function (req, res) {
    res.status(200).send();
});

module.exports = router;