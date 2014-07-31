/**
 * Q + Q-IOのサンプル
 */
module.exports = {

  _config: {},

  index: function(req, res) {
    var Q    = require("q");
    var HTTP = require("q-io/http");

    // シーケンシャルに実行
    Q.fcall(function(){
      return asJson(HTTP.request('http://localhost:9000/message/123'))
    }).then(function(message){
      return [message, asJson(HTTP.request('http://localhost:9000/user/' + message.messageId))];
    }).spread(function(message, user){
      res.view({
        messageId: message.messageId,
        message  : message.message,
        userId   : user.userId,
        userName : user.userName
      });
    }).catch(function(e){
      res.send(500, e);
    }).done();
  },

  sample1: function(req, res) {
    var Q    = require("q");
    var HTTP = require("q-io/http");

    // 並列に投げるだけならQ.allとspreadを使えばシンプルに書ける
    Q.all([
      asJson(HTTP.request('http://localhost:9000/message/123')),
      asJson(HTTP.request('http://localhost:9000/user/123'))
    ]).spread(function(message, user){
      res.view('sample/index', {
        messageId: message.messageId,
        message  : message.message,
        userId   : user.userId,
        userName : user.userName
      });
    }).catch(function(e){
      res.send(500, e);
    }).done();
  },

  sample2: function(req, res) {
    var Q    = require("q");
    var HTTP = require("q-io/http");

    // 組み合わせるとこんな感じ
    Q.all([
      asJson(HTTP.request('http://localhost:9000/message/123')).then(function(message){
        return asJson(HTTP.request('http://localhost:9000/user/' + message.userId)).then(function(user){
          return {
            messageId: message.messageId,
            message  : message.message,
            userId   : user.userId,
            userName : user.userName
          };
        });
      }),
      asJson(HTTP.request('http://localhost:9000/comments/123'))
    ]).spread(function(data, comments){
      res.view('sample/index', {
        message : data,
        comments: comments
      });
    }).catch(function(e){
      res.send(500, e);
    }).done();
  }

};

function asJson(promise){
  return promise.then(function(response){
    return response.body.read();
  }).then(function(body){
    return JSON.parse(body.toString("UTF-8"));
  });
}
