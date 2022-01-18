const mysql = require("mysql2");
// const mysql2 = require("mysql2");
const inquirer = require("inquirer");
// const express = require('express');
require("dotenv").config();
const consoleTable = require("console.table");

// const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log(`connected as id  ${db.threadId}`);
  console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`);
  firstPrompt();
});

const firstPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Departments",
        "Quit",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Departments":
          addDepartment();
          break;

        case "Quit":
          quit();
          break;
      }
    });
};

const viewAllEmployees = () => {
  let query = `select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name,' ',manager.last_name) as manager from employee LEFT JOIN role 
	ON employee.role_id = role.id
  LEFT JOIN department 
  ON department.id = role.department_id
  LEFT JOIN employee manager
	ON manager.id = employee.manager_id`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    firstPrompt();
  });
};

const addEmployee = () => {
let query =  `SELECT role.id, role.title, role.salary 
FROM role `

db.query(query, (err,res) =>{
    if (err) throw err;

    const roleChoices = res.map(({id, title, salary})) ({
        value: id, title: `${title}`, salary: `${salary}`
    });
    console.table(res);
    promptInsert(roleChoices);
})
}

const promptInsert = (roleChoices) => {
inquirer 
.prompt ([{
    type: "input",
    name: "first_name",
    message: "What is the Employee's first name?"
},
{
    type: "input",
    name: "last_name",
    message: "What is the Employee's last name?"
},
{
    type: "list",
    name: "roleId",
    message: "What is the Employees role?",
    choices: roleChoices
},
])
    .then((answer)=>{
        console.log(answer);

        let query = `insert into employee set ?`
        db.query(query, {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id
        },
        (err,res) =>{
            if (err) throw err;

            console.table(res);
            firstPrompt();
        }
        )
    });
}

