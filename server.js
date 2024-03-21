const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// const connection = mysql.createConnection(
//     {
//       host: 'localhost',
//       user: 'root',
//       password: 'password',
//       database: 'employeetracker_db'
//     });


// connection.connect(error => {
//   if (error) throw error;
//   console.log('Successfully connected to the database.')
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
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
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.json(results); // Send JSON response
  });
});

app.get('/employees', (req, res) => {
  const sql = `
    SELECT e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id`;
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







// async function someDatabaseOperation() {
//   const connection = await connectToDatabase();
//   // Use the connection for queries, then close it
//   const [rows] = await connection.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id');
//   console.table(rows);
//   await connection.end();
//}

// function start() {
//     inquirer.prompt([
//         {
//             type: 'list',
//             name: 'action',
//             message: 'What would you like to do?',
//             choices: [
//                 'View all departments',
//                 'View all roles', 
//                 'View all employees', 
//                 'Add a department',
//                 'Add a role',
//                 'Add an employee',
//                 'Update an employee role',
//                 'Exit'                
//             ]
//         }
//     ]).then((answers) => {
//         switch (answers.action) {
//             case 'View all departments':
//                 viewDepartments();
//                 break;
//             case 'View all roles':
//                 viewRoles();
//                 break;
//             case 'View all employees':
//                 viewEmployees();
//                 break;
//             case 'Add a department':
//                 addDepartment();
//                 break;
//             case 'Add a role':
//                 addRole();
//                 break;
//             case 'Add an employee':
//                 addEmployee();
//                 break;
//             case 'Update an employee role':
//                 updateEmployeeRole();
//                 break;
//             case 'Exit':
//                 console.log('Exiting application. Goodbye!');
//                 break;
//         }
//     })
// };

// async function viewDepartments() {
//     const connection = await connectToDatabase();
//     try {
//         const [rows] = await connection.query('SELECT * FROM department');
//         console.table(rows); 
//     } catch (error) {
//         console.error('Error viewing departments:', error);
//     } finally {
//         connection.end();
//         start()
//     }
// }

// async function viewRoles() {
//   const connection = await connectToDatabase();
//   try {
//       const query = `SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id`;
//       const [rows] = await connection.query(query);
//       console.table(rows);
//   } catch (error) {
//       console.error('Error viewing roles:', error);
//   } finally {
//       connection.end();
//       start(); 
//   }
// }

  

//   async function viewEmployees() {
//     const connection = await connectToDatabase();
//     try {
//       const query = `
//         SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
//         FROM employee e
//         LEFT JOIN employee m ON e.manager_id = m.id
//         INNER JOIN role ON e.role_id = role.id
//         INNER JOIN department ON role.department_id = department.id`;
//       const [rows] = await connection.query(query);
//       console.table(rows);
//     } catch (error) {
//       console.error('Error viewing employees:', error);
//     } finally {
//       connection.end();
//       start(); // Restart the prompt to allow more actions
//     }
//   }
  

// async function addDepartment() {
//     inquirer.prompt([
//       {
//         type: 'input',
//         name: 'name',
//         message: 'What is the name of the new department?'
//       }
//     ]).then(async (answers) => {
//       const connection = await connectToDatabase();
//       try {
//         const result = await connection.query('INSERT INTO department (name) VALUES (?)', [answers.name]);
//         console.log(`Added ${answers.name} to departments`);
//       } catch (error) {
//         console.error('Error adding department:', error);
//       } finally {
//         connection.end();
//         start(); 
//       }
//     });
//   }
  

//   async function addRole() {
//     const connection = await connectToDatabase();
//     try {
//       const [departments] = await connection.query('SELECT id, name FROM department');
//       const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
  
//       const answers = await inquirer.prompt([
//         {
//           type: 'input',
//           name: 'title',
//           message: 'What is the title of the new role?'
//         },
//         {
//           type: 'input',
//           name: 'salary',
//           message: 'What is the salary for the new role?'
//         },
//         {
//           type: 'list',
//           name: 'departmentId',
//           message: 'Which department does the role belong to?',
//           choices: departmentChoices
//         }
//       ]);
  
//       await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.departmentId]);
//       console.log(`Added ${answers.title} to roles`);
//     } catch (error) {
//       console.error('Error adding role:', error);
//     } finally {
//       connection.end();
//       start(); 
//     }
//   }
  
    


// async function addEmployee() {
//     const connection = await connectToDatabase();
//     try {
//       const [roles] = await connection.query('SELECT id, title FROM role');
//       const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
  
//       const [managers] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NULL');
//       const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.id }));
//       managerChoices.unshift({ name: 'None', value: null });
  
//       const answers = await inquirer.prompt([
//         {
//           type: 'input',
//           name: 'firstName',
//           message: 'What is the employee\'s first name?'
//         },
//         {
//           type: 'input',
//           name: 'lastName',
//           message: 'What is the employee\'s last name?'
//         },
//         {
//           type: 'list',
//           name: 'roleId',
//           message: 'What is the employee\'s role?',
//           choices: roleChoices
//         },
//         {
//           type: 'list',
//           name: 'managerId',
//           message: 'Who is the employee\'s manager?',
//           choices: managerChoices
//         }
//       ]);
//    const managerId = answers.managerId === null ? null : answers.managerId;

//    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
//    [answers.firstName, answers.lastName, answers.roleId, managerId]);

//    console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
// } catch (error) {
//    console.error('Error adding employee:', error.message);
// } finally {
//    start(); 
// }
// }

// async function updateEmployeeRole() {
//     const connection = await connectToDatabase();
//     try {
//       const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
//       const [roles] = await connection.query('SELECT id, title FROM role');
      
//       const employeeChoices = employees.map(employee => ({
//         name: employee.name,
//         value: employee.id
//       }));
  
//       const roleChoices = roles.map(role => ({
//         name: role.title,
//         value: role.id
//       }));
  
//       const answers = await inquirer.prompt([
//         {
//           type: 'list',
//           name: 'employeeId',
//           message: 'Which employee\'s role do you want to update?',
//           choices: employeeChoices
//         },
//         {
//           type: 'list',
//           name: 'roleId',
//           message: 'Which role do you want to assign to the selected employee?',
//           choices: roleChoices
//         }
//       ]);
  
//       await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.roleId, answers.employeeId]);
//       console.log('Employee role updated successfully.');
  
//     } catch (error) {
//       console.error('Error updating employee role:', error);
//     } finally {
//       connection.end();
//       start(); 
//     }
//   }

// start();