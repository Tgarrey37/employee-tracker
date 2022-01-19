drop database if exists employeesDB;

create database employeesDB;

use employeesDB;

create table department (
    id int not null auto_increment,
    name varchar(100) null,
    primary key (id)
);

create table role (
    id int not null auto_increment,
    title varchar(100) null,
    salary decimal(10,2) null,
    department_id int null,
    foreign key (department_id) references department(id),
    primary key (id)
);

create table employee (
    id int not null auto_increment,
    first_name varchar(100) null,
    last_name varchar(100) null,
    role_id int null,
    manager_id int null,
    primary key (id)
);