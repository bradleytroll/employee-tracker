# Employee Tracker

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [How to Contribute](#how-to-contribute)
- [GitHub Repo](#github-repo)
- [Demonstration Video](#demonstration-vido)

## Description

Employee Tracker is a command-line application that manages a company's employee database using Node.js, Inquirer, and MySQL. It allows users to view and manage the departments, roles, and employees in their company to organize and plan their business better.

## Installation

Before installing, ensure you have Node.js and MySQL installed on your system. Follow these steps to set up Employee Tracker:

1. Clone the repository to your local machine using:

   ```md
   git clone https://github.com/bradleytroll/employee-tracker.git
    ```

2. Navigate to the cloned directory and install the necessary dependencies with:
    ```md
    npm install
    ```
 
3. Set up the MySQL database using the schema and seeds provided:
    Log into your MySQL shell and execute:
   
     ```md
    source path/to/schema.sql;
    source path/to/seeds.sql;
    ```
    Replace path/to/ with the actual path to the schema.sql and seeds.sql files in the cloned repository.

4. Update the database connection settings in connection.js with your MySQL credentials:

    ```md
    const config = {
        host: 'localhost',
        user: 'your_mysql_username', // Default is 'root'
        password: 'your_mysql_password',
        database: 'employeetracker_db'
    };
    ```

## Usage

To start the application, run:

node server.js

Follow the on-screen prompts to manage your company's employee database. The application offers the following functionalities:

- View all departments, roles, and employees
- Add a department, role, or employee
- Update an employee's role
- Exit the application

# Credits

This project utilizes the following technologies:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [mysql12](https://www.npmjs.com/package/mysql2)
= [Inquirer.js](https://www.npmjs.com/package/inquirer)

## How to Contribute

Contributions to improve Employee Tracker are welcome. Please adhere to the following guidelines:

- Open an issue to discuss your idea before making any significant changes.
- Fork the repository and create a new branch for your feature or fix.
- Write clean code with comments as necessary.
- Submit a pull request with a detailed description of your changes.

## GitHub Repo

For more information and to view the source code, visit the Employee Tracker GitHub repository: 

https://github.com/bradleytroll/employee-tracker

## Demonstration Vido

To see the applicaiton in action, please follow the link below for a demonstration video:

https://drive.google.com/file/d/1YHsDJNQ7b4nXs8tUh0WOCsdtF_gqcSwg/view

