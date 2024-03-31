const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const connectToDatabase = require('./db/connection/connection')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employeetracker_db'
    });


connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initCLI();
});

app.get('/departments', (req, res) => {
  const sql = `SELECT id, name FROM department`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.json(results); // Send JSON response
  });
});

app.get('/roles', (req, res) => {
  const sql = `
    SELECT role.id, role.title, department.department_name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.json(results); // Send JSON response
  });
});

app.get('/employees', (req, res) => {
  const sql = `
  SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.department_name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id
  `;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.json(results); // Send JSON response
  });
});

app.post('/departments', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO department (name) VALUES (?)`;
  connection.query(sql, [name], (error, results) => {
    if (error) throw error;
    res.json({ message: `Department named ${name} added successfully.`, id: results.insertId });
  });
});

app.post('/roles', (req, res) => {
  const { title, salary, department_id } = req.body;
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

  connection.query(sql, [title, salary, department_id], (error, results) => {
    if (error) throw error;
    res.send(`Role named ${title} added successfully.`);
  });
});

app.post('/employees', (req, res) => {
  const { first_name, last_name, role_id, manager_id } = req.body;
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

  connection.query(sql, [first_name, last_name, role_id, manager_id], (error, results) => {
    if (error) throw error;
    res.send(`Employee named ${first_name} ${last_name} added successfully.`);
  });
});

app.put('/employees/:id', (req, res) => {
  const { role_id } = req.body;
  const { id } = req.params;
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

  connection.query(sql, [role_id, id], (error, results) => {
    if (error) throw error;
    res.send(`Employee with ID ${id} role updated successfully.`);
  });
});

function initCLI() {
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
  ]).then(answers => {
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


function viewDepartmentsCLI() {
  const sql = `SELECT id, department_name FROM department`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing departments:', error);
    } else {
      console.table(results);
    }
    initCLI(); // Prompt for next action
  });
}

function viewRolesCLI() {
  const sql = `
    SELECT role.id, role.title, department.department_name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing roles:', error);
    } else {
      console.table(results);
    }
    initCLI(); // Prompt for next action
  });
}

function viewEmployeesCLI() {
  const sql = `
  SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.department_name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id
  `;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error viewing employees:', error);
    } else {
      console.table(results);
    }
    initCLI(); // Prompt for next action
  });
}

function addDepartmentCLI() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:'
    }
  ]).then(answer => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    connection.query(sql, [answer.name], (error) => {
      if (error) {
        console.error('Error adding department:', error);
      } else {
        console.log(`Department named ${answer.name} added successfully.`);
      }
      initCLI(); // Prompt for next action
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
    connection.query(sql, [answer.title, answer.salary, answer.department_id], (error) => {
      if (error) {
        console.error('Error adding role:', error);
      } else {
        console.log(`Role ${answer.title} added successfully.`);
      }
      initCLI(); // Prompt for next action
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
    // Allowing for no manager by setting NULL if manager_id is not provided
    const managerId = answer.manager_id ? answer.manager_id : null;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [answer.first_name, answer.last_name, answer.role_id, managerId], (error) => {
      if (error) {
        console.error('Error adding employee:', error);
      } else {
        console.log(`Employee ${answer.first_name} ${answer.last_name} added successfully.`);
      }
      initCLI(); // Prompt for next action
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
    connection.query(sql, [answer.newRoleId, answer.employeeId], (error) => {
      if (error) {
        console.error('Error updating employee role:', error);
      } else {
        console.log(`Employee ID ${answer.employeeId} role updated successfully.`);
      }
      initCLI(); // Prompt for next action
    });
  });
}

// Don't forget to call initCLI() to start the process when the server is ready
initCLI();

