const inquirer = require('inquirer');
const connection = require('./db/connection');

function start() {
    inquirer.createPromptModule([
        {
            type: 'list'
        }
    ])
}