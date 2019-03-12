const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      fs.writeFile(`${exports.dataDir}/${data}.txt`, text, function (err) {
        if (err) {
          console.log(err);
          return;
        } else {
          callback(null, { id: data, text: text });
        }
      });
    }

  });


};
// items = [000.txt, 001.txt, 002.txt]
// [{id:000, text:text}, 001, 002]
exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, function (err, files) {
    if (err) {
      console.log(err);
    } else {
      var array = _.map(files, function (file) {
        return file.split('.')[0];
      });
    }
    callback(err, array);
  });

};

exports.readOne = (id, callback) => {
  fs.access(exports.dataDir + `/${id}.txt`, function (err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.readFile(exports.dataDir + `/${id}.txt`, (err, data) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text: data.toString() });
        }
      })
    }
  });
}

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + `/${id}.txt`, function (err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.readFile(exports.dataDir + `/${id}.txt`, (err, data) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text: data.toString() });
        }
      })
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};



// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
