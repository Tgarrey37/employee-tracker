insert into department (name)
values 
("Engineering"), 
("Legal"), 
("Finance"), 
("Sales");




insert into role (title, salary, department_id)
values 
("Software Engineer", 80000, 1), 
("Lawyer", 150000 , 2), 
("Accountant", 100000, 3), 
("Sales Associate", 75000, 4);





insert into employee (first_name, last_name, role_id, manager_id)
values 
("Taylor", "Smith", 1, null), 
("George", "Garrey", 2, 1), 
("John", "Jones", 3, null), 
("Katie", "Clark", 4, 5), 
("Vanessa", "Robinson", 5, null),
("Michael", "Jackson", 3, 6),
("Ashley", "Donald", 4, 7),
("Tim", "Benson", 1, 9); 