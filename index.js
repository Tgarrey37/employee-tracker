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
          db.end();
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
  let query = `SELECT role.id, role.title, role.salary 
FROM role `;

  db.query(query, (err, res) => {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) =>({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));
    console.table(res);
    promptInsert(roleChoices);
  });
};

const promptInsert = (roleChoices) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the Employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the Employee's last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the Employees role?",
        choices: roleChoices,
      },
      {
        name: 'manager_id',
        type: 'input', 
        message: "What is the employee's manager's ID? "
    },
    ])
    .then((answer) => {
      console.log(answer);

      let query = `insert into employee set ?`;
      db.query(
        query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        (err, res) => {
          if (err) throw err;

          console.table(res);
          firstPrompt();
        }
      );
    });
};
//  update employee role
const updateEmployeeRole = () => {
  let roleQuery = `select * from role`;
  db.query(roleQuery, (err, res) => {
    if (err) throw err;
    const roleArray = res.map(({ id, title }) => ({ name: title, value: id }));
    console.log(roleArray);
    let employeeQuery = `select * from employee`;
    db.query(employeeQuery, (err, res) => {
      if (err) throw err;
      const employeeArray = res.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      console.log(employeeArray);
      promptEmployeeRole(employeeArray, roleArray);
    });
  });
};

//  employee and role arrays to prompt user with info
function promptEmployeeRole(empArr, roleArr) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set for the role",
        choices: empArr,
      },
      {
        type: "list",
        name: "roleId",
        message: " Which role do you want to update",
        choices: roleArr,
      },
    ])
    .then((answer) => {
      let query = `update employee set role_id = ? where id = ?`;
      db.query(query, [answer.roleId, answer.employeeId], (err, res) => {
        if (err) throw err;
        console.table(res);
        firstPrompt();
      });
    });
}

const viewAllRoles = () => {
  let query = `select * from role`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    firstPrompt();
  });
};

const viewAllDepartments = () => {
  let query = `select * from department`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    firstPrompt();
  });
};

const addRole = () => {
  let query = `select * from department `;
  db.query(query, (err, res) => {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`
    }));
    console.table(res);
    promptAddRole(departmentChoices);
  });
};

  const promptAddRole = (departmentChoices) =>{
    inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is your Role Title ?"

      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is your role Salary?"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },

    ]) .then((answer)=>{
      let query = `insert into role set ?`

      db.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
      (err, res) => {
        if (err) throw err;

        console.table(res);
        firstPrompt();
      });
    })
  }

  function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = db.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                firstPrompt();
            }
        )
    })
  }