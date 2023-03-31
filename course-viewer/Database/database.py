from flask import Flask, request, render_template, jsonify, make_response
# from email_validator import validate_email, EmailNotValidError
import pandas as pd
import datetime
import pyodbc
import json

app = Flask(__name__)

def establish_sql_connection():

    username = "sa"
    password = "Pass123!"
    # server = '172.20.0.3'
    server = 'db'
    database = 'CoursesDB'

    db = pyodbc.connect('Driver={/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.2.1}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    # db = pyodbc.connect('Driver={/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.2.so.1.1}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    # db = pyodbc.connect('Driver={SQL Server}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    print('---SUCCESSS----')
    return db

@app.route("/get_assignments", methods=['GET'])
# params: module_code, semester
# gets the assignments of a particular module
def get_assignments_table():

    # get the relevant parameters
    module_code = request.args.get('module_code')
    semester = request.args.get('semester')

    db = establish_sql_connection()
    cursor = db.cursor()

    query = f"\
        SELECT *\
        FROM Assignments\
        WHERE [Module Code] = '{module_code}' AND [Semester] = '{semester}'\
    "

    cursor.execute(query)
    # extract the column names
    columns = [column[0] for column in cursor.description]
    result = cursor.fetchall()
    # convert the Row Objects into dictionaries
    data = []
    for row in result:
        data.append(dict(zip(columns, row)))

    # close the connection
    cursor.close()
    db.close()

    # returns a json response
    return json.dumps(data, default=str)

@app.route('/add_new_assignments', methods=['POST'])
# params: module_code, semester, assignment_name, weightage, assignment_type, group_or_indv, start_date, due_date
# adds a new assignment to the assignment table
def add_new_assignments():
    response = request.json['params']
    module_code = response['module_code']
    semester = response['semester']
    assignment_name = response['assignment_name']
    weightage = response['weightage']
    assignment_type = response['assignment_type']
    group_or_indv = response['group_or_indv']
    start_date = response['start_date']
    due_date = response['due_date']

    query = f"\
        INSERT INTO Assignments\
        ([Module Code], [Semester], [Assignment Name], [Weightage],\
            [Assignment Type], [Group or Individual], [Start Date],\
                [Due Date])\
        VALUES ('{module_code}', '{semester}', '{assignment_name}',\
            '{weightage}', '{assignment_type}', '{group_or_indv}',\
                '{start_date}', '{due_date}')\
    "

    db = establish_sql_connection()
    cursor = db.cursor()

    cursor.execute(query)
    cursor.commit()

    cursor.close()
    db.close()

    return "", 201

@app.route('/update_assignments', methods=['PUT'])
# params: original_assignment_name, module_code, semester, assignment_name, weightage, assignment_type, group_or_indv, start_date, due_date
# adds a new assignment to the assignment table
def update_assignments():
    response = request.json['params']
    # just need something to identify the change
    original_assignment_name = response['original_assignment_name']
    module_code = response['module_code']
    semester = response['semester']
    assignment_name = response['assignment_name']
    weightage = response['weightage']
    assignment_type = response['assignment_type']
    group_or_indv = response['group_or_indv']
    start_date = response['start_date']
    due_date = response['due_date']

    query = f"\
        UPDATE Assignments\
        SET [Assignment Name] = '{assignment_name}', [Weightage] = '{weightage}',\
        [Assignment Type]='{assignment_type}', [Group or Individual]='{group_or_indv}',\
        [Start Date]='{start_date}', [Due Date]='{due_date}'\
        WHERE [Assignment Name] = '{original_assignment_name}' AND [Module Code] = '{module_code}'\
            AND [Semester]='{semester}'\
    "

    db = establish_sql_connection()
    cursor = db.cursor()

    cursor.execute(query)
    cursor.commit()

    cursor.close()
    db.close()

    return "", 201


@app.route("/get_instructors", methods=['GET'])
def get_instructors_table():

    db = establish_sql_connection()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM Instructors')
    # extract the column names
    columns = [column[0] for column in cursor.description]
    result = cursor.fetchall()
    # convert the Row Objects into dictionaries
    data = []
    for row in result:
        data.append(dict(zip(columns, row)))
    
    # close the connection
    cursor.close()
    db.close()

    # returns a json response
    return json.dumps(data, default=str)

@app.route("/modules_for_instructor", methods=["GET"])
# params: instructor, semester
# get the list of modules the prof is currently teaching
def get_modules_for_instructor():
    # get the relevant parameters
    instructor = request.args.get('instructor')
    semester = request.args.get('semester')

    # establish the database connection
    db = establish_sql_connection()
    cursor = db.cursor()

    # get all the module codes that the instructor is currently teaching
    query = f"\
        SELECT [Module Code]\
        FROM Instructors\
        WHERE Semester={semester} AND [Instructor]='{instructor}'\
    "

    result = cursor.execute(query)
    # extract the column names
    columns = [column[0] for column in cursor.description]
    # convert the Row Object
    data = []
    for module_code in result:
        data.append(module_code)

    cursor.close()
    db.close()

    return json.dumps(data, default=str)
