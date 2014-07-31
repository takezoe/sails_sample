/**
 * async + request-jsonのサンプル
 */
module.exports = {

  _config: {},

  index: function(req, res) {
    var async = require("async")

    var request = require('request-json');
    var client = request.newClient('http://localhost:9000/');

    async.series([
      function(callback){
        client.get('message/123', {}, function(err, res, body) {
          callback(err, body);
        });
      },
      function(callback){
        client.get('user/123', {}, function(err, res, body) {
          callback(err, body);
        });
      }
    ], function(err, results){
      if(err){
        throw err;
      }
      console.log(results);
      res.view('sample/index', {
        message : results[0].message,
        userName: results[1].userName
      });
    });
  }


};
