var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/../debug.log', {flags : 'w'});
var log_stdout = process.stdout;
var log_stderr = process.stderr;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
  log_stderr.write(util.format(d) + '\n');
};
var access = fs.createWriteStream(__dirname + '/../console.log', {flags : 'w'});
process.stdout.write = process.stderr.write = access.write.bind(access);

process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});