'use strict'

const async = require('async');

/* 
async.series - invokes your functions serially (waiting for each preceding one to finish before starting next). 
The callback function receives an array of result objects when all the tasks have completed. 
If an error is encountered in any of the tasks, no more functions are run but the final callback is called with the error value

async.parallel - will kick-off all simultaneously. Run the tasks collection of functions in parallel,
without waiting until the previous function has completed. If any of the functions pass an error to its callback, 
the main callback is immediately called with the value of the error. 
Once the tasks have completed, the results are passed to the finalcallback as an array.
*/

async.parallel({
    task1: (callback) => {
        setTimeout(function () {
            console.log('Task One');
            callback(null, 1);
        }, 300);
    },
    task2: (callback) => {
        setTimeout(function () {
            console.log('Task Two');
            callback(null, 2);
        }, 100);
    },
    task3: (callback) => {
        setTimeout(function () {
            console.log('Task Three');
            callback(new Error('Failed'));
        }, 200);
    },
    task4: (callback) => {
        setTimeout(function () {
            console.log('Task Four');
            callback(null, 4);
        }, 100);
    }
}, (err, result) => { console.log(result)
//result { task2: 2, task4: 4, task3: undefined }
})

async.series({
    task1: (callback) => {
        setTimeout(function () {
            console.log('Task One');
            callback(null, 1);
        }, 300);
    },
    task2: (callback) => {
        setTimeout(function () {
            console.log('Task Two');
            callback(null, 2);
        }, 100);
    },
    task3: (callback) => {
        setTimeout(function () {
            console.log('Task Three');
            callback(new Error('Failed'));
        }, 200);
    },
    task4: (callback) => {
        setTimeout(function () {
            console.log('Task Four');
            callback(null, 4);
        }, 100);
    }
}, (err, result) => { console.log(result)
//result { task1: 1, task2: 2, task3: undefined }
})
