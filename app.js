// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);

// これだけだとクライアントの接続を切断することができない
process.on('uncaughtException', function (err) {
  console.log(err);
});
