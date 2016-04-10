var fs = require('fs');
var exec = require('child_process').exec;

function init(){
  tryRemoveFile('./dist');
  tryRemoveFile('./dist.zip');
}

function tryRemoveFile(path){
  fs.access(path, fs.R_OK | fs.W_OK, (error) => {
    if(!error) {
      console.log(path + ' found. Removing it...');
      exec('rm -rf ' + path);
    }
  });
}

init();
