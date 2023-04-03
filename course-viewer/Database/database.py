from flask import Flask, request, render_template, jsonify, make_response
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
# from email_validator import validate_email, EmailNotValidError
import pandas as pd
import datetime
import pyodbc
import json
import random

app = Flask(__name__)

# json web token configuration
app.config['JWT_SECRET_KEY'] = "dsa3101"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours = 2) # how long the access token will last for
jwt  = JWTManager(app)

# helper function that establishes connection with our database
def establish_sql_connection():

    username = "sa"
    password = "Pass123!"
    server = 'db'
    # server = 'localhost'
    database = 'CoursesDB'

    db = pyodbc.connect('Driver={/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.2.1}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    # db = pyodbc.connect('Driver={/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.2.so.1.1}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    # db = pyodbc.connect('Driver={SQL Server}; Server='+server+'; Database='+database+'; Uid='+username+'; Pwd='+ password)
    print('---SUCCESSS----')
    return db


@app.route('/token', methods=['POST'])
def create_token():
    # getting the POST request values
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    print(email, password)

    query = f"\
        SELECT [Instructor]\
        FROM Login\
        WHERE [Email] = '{email}' AND [Password] = '{password}'\
    "

    db = establish_sql_connection()
    cursor = db.cursor()

    result = cursor.execute(query)
    columns = [column[0] for column in cursor.description]

    if (not result): # if the login details are not correct
        return {"msg" : "Wrong email or password"}, 401 # returns Unauthorized response status code
    
    name = list(result.fetchall()[0])[0] # extract the name of the instructor

    # if the login details are correct, then we return the access token
    access_token = create_access_token(identity=email)
    response = {
        "access_token" : access_token,
        "name" : name
    }

    return response

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(datetime.timezone.utc)
        target_timestamp = datetime.timestamp(now + datetime.timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    
@app.route('/logout', methods=["POST"])
def logout():
    response = jsonify({"msg" : "logout successful"})
    unset_jwt_cookies(response) # Modify a Flask Response to delete the cookies containing access or refresh JWTs. Also deletes the corresponding CSRF cookies if applicable.
    return response


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
        current_dict = dict(zip(columns, row))
        current_dict['stress_score'] = random.randint(1, 5)
        data.append(current_dict)

    # close the connection
    cursor.close()
    db.close()

    # returns a json response
    return json.dumps(data, default=str)

@app.route('/add_new_assignments', methods=['POST'])
# params: module_code, semester, name, weightage, assignment_type, group_or_indv, start_date, due_date
# adds a new assignment to the assignment table
def add_new_assignments():
    response = request.json['params']
    #module_code = response['module_code']
    #semester = response['semester']
    name = response['name']
    type = response['type']
    group_or_indv = response['group_or_indv']
    weightage = response['weightage']
    start_date = response['start_date']
    due_date = response['due_date']

    query = f"\
        INSERT INTO Assignments\
        ([Name], [Weightage],\
            [Group or Individual], [Type], [Start Date],\
                [Due Date])\
        VALUES ('{name}',\
            '{weightage}', '{type}', '{group_or_indv}',\
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
# params: original_name, module_code, semester, name, weightage, type, group_or_indv, start_date, due_date
# adds a new assignment to the assignment table
def update_assignments():
    response = request.json['params']
    # just need something to identify the change
    original_name = response['original_name']
    module_code = response['module_code']
    semester = response['semester']
    name = response['name']
    weightage = response['weightage']
    type = response['type']
    group_or_indv = response['group_or_indv']
    start_date = response['start_date']
    due_date = response['due_date']

    query = f"\
        UPDATE Assignments\
        SET [Name] = '{name}', [Weightage] = '{weightage}',\
        [Type]='{type}', [Group or Individual]='{group_or_indv}',\
        [Start Date]='{start_date}', [Due Date]='{due_date}'\
        WHERE [Name] = '{original_name}' AND [Module Code] = '{module_code}'\
            AND [Semester]='{semester}'\
    "

    db = establish_sql_connection()
    cursor = db.cursor()

    cursor.execute(query)
    cursor.commit()

    cursor.close()
    db.close()

    return "", 201

@app.route("/get_assignment_pairings", methods=['GET'])
# params: module_code, semester
# get the assignments of other modules that pairs with this
def get_assignment_pairings():

    # get the relevant parameters
    module_code = request.args.get('module_code')
    semester = request.args.get('semester')

    db = establish_sql_connection()
    cursor = db.cursor()

    # get the assignment values for module 2 and module 1
    query1 = f"\
        SELECT * \
        FROM (SELECT * \
            FROM Assignments \
            WHERE Semester='{semester}') a\
        INNER JOIN (\
            (SELECT [Module 1], [Count]\
            FROM module_pairs \
            WHERE [Semester]='{semester}' AND [Module 2]='{module_code}'\
                AND [Count] > 0 AND [Module 1] != '{module_code}')\
            UNION\
            (SELECT [Module 2], [Count]\
            FROM module_pairs \
            WHERE [Semester]='{semester}' AND [Module 1]='{module_code}'\
                AND [Count] > 0 AND [Module 2] != '{module_code}')) b \
        ON (a.[Module Code] = b.[Module 1])\
        INNER JOIN (SELECT DISTINCT [Instructor], [Module Code], [Semester]\
        FROM Instructors WHERE [Semester]='{semester}') c\
        ON (a.[Module Code] = c.[Module Code])\
        INNER JOIN Login d\
        ON (c.[Instructor] = d.[Instructor])\
    "

    cursor.execute(query1)
    # extract the column names
    columns = [column[0] for column in cursor.description]
    pairing_assignment_results = cursor.fetchall()
    # convert the Row Objects into dictionaries
    query2 = f"\
        SELECT [Count]\
        FROM student_counts\
        WHERE [Module Code] = '{module_code}' AND [Semester] ='{semester}'\
    "
    cursor.execute(query2)
    module_count = cursor.fetchall()[0][0]

    data = []
    for row in pairing_assignment_results:
        current_dict = dict(zip(columns, row))
        current_dict['stress_score'] = random.randint(1, 5) * (current_dict['Count'] / module_count)
        data.append(current_dict)

    # close the connection
    cursor.close()
    db.close()

    # returns a json response
    return json.dumps(data, default=str)

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
        SELECT DISTINCT [Module Code]\
        FROM Instructors\
        WHERE Semester='{semester}' AND [Instructor]='{instructor}'\
    "

    cursor.execute(query)
    result = cursor.fetchall()
    # extract the column names
    columns = [column[0] for column in cursor.description]
    # convert the Row Object
    data = []
    for row in result:
        data.append(row[0])

    cursor.close()
    db.close()

    return json.dumps(data, default=str)

@app.route("/modules_for_semester", methods=["GET"])
# params: semester
# given a semester, provide all the modules for that semester
def get_modules_for_semester():
    # get the relevant parameters
    semester = request.args.get('semester')
    print(semester)

    # establish the database connection
    db = establish_sql_connection()
    cursor = db.cursor()

    # get all the module codes that the instructor is currently teaching
    query = f"\
        SELECT DISTINCT [Module Code]\
        FROM Instructors\
        WHERE Semester='{semester}'\
    "

    cursor.execute(query)
    result = cursor.fetchall()
    # extract the column names
    columns = [column[0] for column in cursor.description]
    # convert the Row Object
    data = []
    for row in result:
        data.append(row[0])

    cursor.close()
    db.close()

    return json.dumps(data, default=str)

@app.route("/module_list_assignments", methods=["GET"])
# params: semester, module_list
# given a semester and the list of modules, provide all the assignments for the list of modules
def get_module_list_assignments():
    # get the relevant parameters
    semester = request.args.get('semester')
    module_list = tuple(request.args.getlist('module_list[]'))
    # formatting for the module_list
    if (len(module_list) == 1):
        module_list = f"('{module_list[0]}')"

    # establish the database connection
    db = establish_sql_connection()
    cursor = db.cursor()

    # get all the module codes that the instructor is currently teaching
    query = f"\
        SELECT *\
        FROM (SELECT *\
        FROM Assignments\
        WHERE Semester='{semester}' AND [Module Code] IN {module_list}) a\
        INNER JOIN (SELECT DISTINCT [Instructor], [Module Code], [Semester]\
        FROM Instructors WHERE [Semester]='{semester}') b\
        ON (a.[Module Code] = b.[Module Code])\
        INNER JOIN Login c\
        ON (b.[Instructor] = c.[Instructor])\
    "

    cursor.execute(query)
    result = cursor.fetchall()
    # extract the column names
    columns = [column[0] for column in cursor.description]
    # convert the Row Object
    data = []
    for row in result:
        current_dict = dict(zip(columns, row))
        current_dict['stress_score'] = random.randint(1, 5)
        data.append(current_dict)

    cursor.close()
    db.close()

    return json.dumps(data, default=str)