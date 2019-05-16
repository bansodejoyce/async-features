'use strict'

const http = require('http');
const async = require('async');
const access_key = '47173ef6e1b30e8*************';

async.waterfall([
    task1,
    task2,
], function (err, result) {
    //if(err) return err
    //else return result;
    console.log(result);
});

function task1(callback) {
    let base = 'AMD';
    let symbols = 'INR,USD,ALL,EUR,YER';
    let splitSymbols = symbols.split(',')
    http.get(`http://data.fixer.io/api/symbols?access_key=${access_key}`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        })
        response.on('end', () => {
            let result = JSON.parse(data)
            let symbolArray = [];
            splitSymbols.forEach(element => {
                let value = {
                    elementName: element,
                    elementValue: result['symbols'][element]
                };
                symbolArray.push(value);
            });
            callback(null, symbolArray, base);
        })
    }).on('error', (error) => callback(error));
}

function task2(dataFromTask1, base, callback) {
    http.get(`http://data.fixer.io/api/latest?access_key=${access_key}`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        })
        response.on('end', () => {
            let result = JSON.parse(data);
            const valueBase = result.rates[base];
            let valueArray = [];
            dataFromTask1.forEach((element) => {
                let value = {
                    elementName: element.elementName,
                    elementValue: element.elementValue,
                    currencyValue: (result.rates[element.elementName] / valueBase).toFixed(3)
                };
                valueArray.push(value)
            });
            callback(null, valueArray)
        })
    }).on('error', (error) => callback(error))
}