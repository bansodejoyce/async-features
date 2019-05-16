'use strict'

const http = require('http');
const async = require('async');
const access_key = '47173ef6e1b30e8b4dcc288c0f5d176a';

let symbolValueMapping = () =>{
    let base = 'AMD';
    let symbols = 'INR,USD,ALL,EUR,YER';
    let splitSymbols = symbols.split(',')
    async.series({
        task1: (callback)=> {
            http.get(`http://data.fixer.io/api/symbols?access_key=${access_key}`, (response) => {
                let data ='';
                response.on('data', (chunk) => {            
                    data += chunk;            
                })
                response.on('end',()=>{
                   let result = JSON.parse(data)
                   let symbolArray =[];
                    splitSymbols.forEach(element => {
                        let value = {
                            elementName:element,
                            elementValue:result['symbols'][element]
                        };
                        symbolArray.push(value);
                    });
                    callback(null,symbolArray);
                })
            }).on('error',(error)=> callback(error));
        },
        task2: (callback)=>{
            http.get(`http://data.fixer.io/api/latest?access_key=${access_key}`, (response) => {
                let data ='';
                response.on('data', (chunk) => {            
                    data += chunk;            
                })
                response.on('end', () => {
                    let result = JSON.parse(data);
                     callback(null, result)
                })
            }).on('error',(error)=> callback(error))  
        },
    },(err, result) => { 
        if(err){
            //return with error
        }
        const valueBase = result.task2.rates[base];
        let valueArray = [];
        result.task1.forEach((element) => {
            let value = {
                elementName:element.elementName,
                elementValue:element.elementValue,
                currencyValue: (result.task2.rates[element.elementName] / valueBase).toFixed(3)
            };
            valueArray.push(value)
        });
        console.log(valueArray)
        //return with result
    })
};
