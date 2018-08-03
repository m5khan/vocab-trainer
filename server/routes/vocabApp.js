var express = require('express');
var router = express.Router();
var dbConnector = require('../core/DBConnector');
var mw = require('../core/middleWare');

router.get('/*', function (req, res, next) {
    if (req.session && req.session.loggedin == true) {
        next();
    } else { 
        res.status('401').send('unauthorized');
    }
});

router.get('/list', function (req, res) {
    var data = {
        userid : req.session.userid,
        email : req.session.email
    }; 
    dbConnector.List.getList(data, function (err, result) {
        if (err) throw err;
        res.json(result.list);
    });
});

router.get('/list/add', function (req, res) {
    var name = req.query.name;
    var data = {
        userid : req.session.userid,
        email : req.session.email,
        listname : name
    };
    dbConnector.List.addList(data, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/list/drop', function (req, res) {
    var id = req.query.listid;
    var data = {
        userid : req.session.userid,
        email : req.session.email,
        listid : id
    };
    dbConnector.List.delList(data, function (err, result) {
        if (err) throw err;
        res.status(200).send('success');
    });
});

// if no listid provided, then return all words.
router.get('/words', function (req, res) {
    var listId = req.query.listid
    var data = {
        userid : req.session.userid,
    }
    if (listId) data.listid = listId;
    dbConnector.Word.getWords(data, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/words/add', mw.auth, function (req, res) {
    var body = req.body;
    var d = JSON.parse(body.data);
    var data = {
        userid : req.session.userid,
        listid : d.listid,
        word : d.word,
        meaning : d.meaning,
        sentence : d.sentence, 
        mastered : false
    };
    dbConnector.Word.add(data, function (err, data) {
        if (err) throw err;
        //res.status(200).send("success");
        res.json(data);
    });
});

router.post('/words/update', mw.auth, function (req, res) {
    var body = req.body;
    var d = JSON.parse(body.data);
    var data = {
        _id : d._id,
        userid : req.session.userid,
        listid : d.listid,
        word : d.word,
        meaning : d.meaning,
        sentence : d.sentence, 
        mastered : d.mastered
    };
    dbConnector.Word.update(data, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

router.get('/words/remove', function (req, res) {
    var id = req.query.id;
    var data = {
        userid : req.session.userid,
        id : id
    }
    dbConnector.Word.remove(data, function (err) {
        if (err) throw err;
        res.status(200).send("success");
    });
});

router.get('/words/carry', function (req, res) {
    var id = req.query.id;
    var data = {
        userid : req.session.userid,
        wordId : id
    }
    dbConnector.Word.carry(data, function (err, result) {
        if (err) throw err;
        res.status(200).send('word added to carry list');
    });
});

router.get('/words/drop', function (req, res) {
    var id = req.query.id;
    var data = {
        userid : req.session.userid,
        wordId : id
    }
    dbConnector.Word.drop(data, function (err, result) {
        if (err) throw err;
        res.status(200).send('word dropped from carry list');
    });
});

router.get('/words/clearcarry', function (req, res) {
    var data = {
        userid : req.session.userid
    }
    dbConnector.Word.clearCarry(data, function (err, result) {
        if (err) throw err;
        res.status(200).send('carry list cleared');
    });
});

router.get('/words/carried', function (req, res) {
    var data = {
        userid : req.session.userid
    }
    dbConnector.Word.carriedWords(data, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
});
    

module.exports = router;