// Imports various modules and makes necessary connections
const express = require('express');
const inquirer = require('inquirer');
const connectToDatabase = require('./db/connection/connection');
const db = connectToDatabase();

// Creates a fucntion that initiates the CLI for the app
function initCLI() {
  // Uses Inquirer to display a list of actions to the user and capture their responses.
  inquirer.prompt([
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
        'Update an employee role',
        'Exit'
      ]
    }
    // Handles the user's choice stored in their answers
  ]).then(answers => {
    // Fires function corresponding to the user's choice
    switch (answers.action) {
      case 'View all departments':
        viewDepartmentsCLI();
        break;
      case 'View all roles':
        viewRolesCLI();
        break;
      case 'View all employees':
        viewEmployeesCLI();
        break;
      case 'Add a department':
        addDepartmentCLI();
        break;
      case 'Add a role':
        addRoleCLI();
        break;
      case 'Add an employee':
        addEmployeeCLI();
        break;
      case 'Update an employee role':
        updateEmployeeRoleCLI();
        break;
      case 'Exit':
        console.log('Exiting application. Goodbye!');
        process.exit(); // Exit the application
    }
  });
}

// CRUD fucntions defined below:

function viewDepartmentsCLI() {
  const sql = `SELECT id, department_name FROM department`;
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing departments:', error);
    } else {
      console.table(results);
    }
    initCLI(); 
  });
}

function viewRolesCLI() {
  const sql = `
    SELECT role.id, role.title, department.department_name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id`;
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing roles:', error);
    } else {
      console.table(results);
    }
    initCLI(); 
})}

function viewEmployeesCLI() {
  const sql = `
  SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.department_name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id
  `;
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing employees:', error);
    } else {
      console.table(results);
    }
    initCLI(); 
  });
}

function addDepartmentCLI() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department_name',
      message: 'Enter the name of the new department:'
    }
  ]).then(answer => {
    const sql = `INSERT INTO department (department_name) VALUES (?)`;
    db.query(sql, [answer.department_name], (error) => {
      if (error) {
        console.error('Error adding department:', error);
      } else {
        console.log(`Department named ${answer.department_name} added successfully.`);
      }
      initCLI(); 
    });
  });
}

function addRoleCLI() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the new role:'
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID for the new role:'
    }
  ]).then(answer => {
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    db.query(sql, [answer.title, answer.salary, answer.department_id], (error) => {
      if (error) {
        console.error('Error adding role:', error);
      } else {
        console.log(`Role ${answer.title} added successfully.`);
      }
      initCLI(); 
    });
  });
}

function addEmployeeCLI() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Enter the employee's first name:"
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Enter the employee's last name:"
    },
    {
      type: 'input',
      name: 'role_id',
      message: "Enter the employee's role ID:"
    },
    {
      type: 'input',
      name: 'manager_id',
      message: "Enter the employee's manager ID (leave blank if none):"
    }
  ]).then(answer => {
    const managerId = answer.manager_id ? answer.manager_id : null;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    db.query(sql, [answer.first_name, answer.last_name, answer.role_id, managerId], (error) => {
      if (error) {
        console.error('Error adding employee:', error);
      } else {
        console.log(`Employee ${answer.first_name} ${answer.last_name} added successfully.`);
      }
      initCLI(); 
    });
  });
}

function updateEmployeeRoleCLI() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: "Enter the ID of the employee whose role you want to update:"
    },
    {
      type: 'input',
      name: 'newRoleId',
      message: "Enter the new role ID for this employee:"
    }
  ]).then(answer => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    db.query(sql, [answer.newRoleId, answer.employeeId], (error) => {
      if (error) {
        console.error('Error updating employee role:', error);
      } else {
        console.log(`Employee ID ${answer.employeeId} role updated successfully.`);
      }
      initCLI(); 
    });
  });
}

// Initiates the CLI application by calling the fucntion. 
initCLI();