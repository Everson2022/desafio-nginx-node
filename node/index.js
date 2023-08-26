const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'nodedb',
};

app.get('/', (req, res) => {
  insertPeopleName(res);
});

app.listen(PORT, () => {
  console.log('STARTED AT ' + PORT);
});

async function getRandomName() {
    const response = await axios.get('https://swapi.dev/api/people');
    const min = 1;
    const allPeoples = response.data.results;
    const max = parseInt(allPeoples.length);
    const RANDOM = Math.floor(Math.random() * (max - min) + min);
    return allPeoples[RANDOM].name;
}

async function insertPeopleName(res) {
    const name = await getRandomName();
    const connection = mysql.createConnection(config);
    const sql = `INSERT INTO people(name) values('${name}')`;
        
    connection.query(sql);
    console.log(`${name} inserido no banco!`);    
    showPeopleName(res, connection);
}

function showPeopleName(res, connection) {    
    const sql = `SELECT id, name FROM people`;  

    connection.query(sql, (error, results, fields) => {
        if (error) {
        throw error
        };
        
        let table = '<table>';
        table += '<tr><th>#</th><th>Name</th></tr>';
        for(let people of results) {      
        table += `<tr><td>${people.id}</td><td>${people.name}</td></tr>`;
        }

        table += '</table>';    
        res.send('<h1>Full Cycle Rocks!</h1>' + table);    
    });   
    connection.end();
}