var db = require('mongoskin').db( process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test');
var ObjectId = require('mongoskin').ObjectID;


var User = {
    add : function (data, callback) {
        db.collection('user').insert(data, callback);
    },

    find : function (data, callback) {
        db.collection('user').find(data, function (err, result) {
            if (err) throw err;
            result.toArray(callback);
        });      
    },

    auth: function (data, callback) {
        db.collection('user').findOne({
            email : data.email,
            pwd : data.pass
        }, callback);
    }
}

var List = {
    getList : function (data, callback){
        db.collection('user').findOne({
            _id : ObjectId(data.userid),
            email: data.email
        }, callback); 
    },

    addList : function (data, callback) {
        var listId = new ObjectId();
        db.collection('user').update({
            _id : ObjectId(data.userid),
            email : data.email
        }, 
        {'$push': {list: {
                _id: listId,
                name: data.listname
                }
            }
        }, function (err) {
            var obj = {
                _id : listId,
                name : data.listname
            }
            callback(err, obj);
        });
    },

    delList : function (data, callback) {
        db.collection('user').update({ _id : ObjectId(data.userid) , email : data.email },
             { '$pull': { list: { _id: ObjectId(data.listid) } } }, function (err) {
            if (err) throw err;
            db.collection('words').remove({ userid : data.userid , listid : data.listid }, callback);
        });
    }
}


var Word = {

    add : function (data, callback) {
        db.collection('words').insert(data, callback);
    },
    
    update : function (data, callback) {
        var id = data._id;
        delete data._id;
        db.collection('words').update({_id : ObjectId(id) , userid : data.userid} , data, callback);
    },

    getWords : function (data, callback) {
        db.collection('words').find(data, function (err, cursor) {
            if (err) throw err;
            cursor.toArray(callback);
        });
    },

    remove : function (data, callback) {
        if (data.id) {
            var id = ObjectId(data.id);
            delete data.id;
            data._id = id;
        }
        db.collection('words').remove(data, callback);
    },

    carry : function (data, callback) {
        db.collection('user').update({ _id: ObjectId(data.userid) }, {
            '$addToSet' : {
                carry:  ObjectId(data.wordId) 
            }
        }, callback);  
    },

    drop : function (data, callback) {
        db.collection('user').update({ _id: ObjectId(data.userid) }, {
            '$pull' : {
                carry:  ObjectId(data.wordId) 
            }
        }, callback);
    },

    clearCarry : function (data, callback) {
        db.collection('user').update({ _id: ObjectId(data.userid) }, {
            '$set' : { carry: [] }
        }, callback);
    },

    carriedWords : function (data, callback) {
        db.collection('user').findOne({ _id : ObjectId(data.userid) } , function (err, result) {
            if (err) throw err;
            var clist = result.carry;
            //var carryList = [];
            //for (var i = 0; i < clist.length ; i++) { 
            //    carryList.push(ObjectId(clist[i]));
            //}
            db.collection('words').find({ _id : { '$in' : clist } }, function (err, cursor) {
                if (err) throw err;
                cursor.toArray(callback);
            });
        });
    }
}





module.exports.User = User;
module.exports.List = List;
module.exports.Word = Word;