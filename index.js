const inquirer = require('inquirer');
const connection = require('./db/connection');

function start() {
    inquirer.createPromptModule([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles', 
                'View all employees', 
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an exmployee role',
                'Exit'                
            ]
        }
    ]).then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'Veiw all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    })
};