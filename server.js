const mysql = require("mysql");
const mysql2 = require("mysql2");
const inquirer = require("inquirer");
// const express = require('express');
const consoleTable = require("console.table");

const PORT = 3001;
// const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'password',
    database: 'test'
    
});

 connection.connect (function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadID}`);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    firstPrompt();
});

const firstPrompt = () =>{
inquirer 
.prompt({
    type: 'list',
    name: 'task',
    message: 'What would you like to do?',
    choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Departments',
        'Quit'
    ]
})
.then (function ({ task }){
    switch (task) {
        case 'View All Employees':
            viewEmployees();
            break;

        case "Add Employee":
            addEmployee();
            break;

        case "Update Employee Role":
            updateEmployeeRole();
            break;

         case 'View All Roles':
                viewAllRoles();
                break;

        case 'Add Role':
            addRole();
            break;

        case 'View All Departments':
            viewAllDepartments();
            break;

        case 'Add Departments':
            addDepartment();
            break;

        case  'Quit':
            quit();
            break;
    }
});
}
// app.listen(PORT, () =>
//   console.log(`App listening at http://localhost:${PORT} 🚀`)
// );