/*
    Library for storing and editing data
 */

// Dependenies
const fs    = require('fs');
const path  = require('path');

// Container for the module ( to be exported )
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data
lib.create = function(dir, file, data, callback) {

    // Open file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json','wx', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {

            // Convert data to string
            var stringData = JSON.stringify(data);

            // Write to file and close file
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data){
        callback(err, data);
    });
};

lib.update = function(dir, file, data, callback){
  // Open the file for writing
  fs.open(lib.baseDir + dir + '/' + file + '.json','r+',function(err, fileDescriptor){
      if(!err && fileDescriptor) {
         const stringData = JSON.stringify(data);

         fs.truncate(fileDescriptor, function(err){
             if(!err) {
                 fs.writeFile(fileDescriptor, stringData, function(err){
                     if(!err){
                         fs.close(fileDescriptor, function(err){
                             if(!err) {
                                 callback(false);
                             } else {
                                 callback('Error closing existing file');
                             }
                         })
                     } else {
                         callback('Error writing to existing file');
                     }
                 })
             } else {
                 callback('Error truncating file');
             }
         })
      } else {
          callback('Could now open the file for updating, it may not exist yet');
      }
  })
};

// Delete a file
lib.delete= function(dir, file, callback){
    // unlink the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
        if(!err) {
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    })
};

// Export the module
module.exports = lib;