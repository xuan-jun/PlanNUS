from flask import Flask, request, render_template, jsonify, make_response
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
# from email_validator import validate_email, EmailNotValidError
import pandas as pd
import datetime
import pyodbc
import json
import random
import numpy as np
import re
from model import indiv_score

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
        current_dict['stress_score'] = indiv_score(
            current_dict['Weightage'], current_dict['Type'],
            current_dict['Group or Individual'],current_dict['Level'],
            (datetime.datetime.strptime(current_dict['Start Date'], '%d-%b-%y') if current_dict['Start Date'] else None),
            (datetime.datetime.strptime(current_dict['Due Date'], '%d-%b-%y') if current_dict['Due Date'] else None)
        )
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

    # provides mapping for level of the module as we need that for prediction
    level_mapping = {
        '1' : 'level_1k',
        '2' : 'level_2k',
        '3' : 'level_3k',
        '4' : 'level_4k'
    }

    response = request.json['params']
    module_code = response['module_code']
    semester = response['semester']
    name = response['name']
    type = response['type']
    group_or_indv = response['group_or_indv']
    weightage = response['weightage']
    start_date = "" if response['start_date'] == "Invalid date" else response['start_date']
    due_date = response['due_date']
    # search for the first value that is an integer and map to the module level
    level_value = module_code[re.search(r'\d', module_code).start()]
    level_code = level_mapping[level_value]

    query = f"\
        INSERT INTO Assignments\
        ([Module Code], [Semester], [Name], [Weightage],\
            [Type], [Group or Individual],  [Start Date],\
                [Due Date], [Level])\
        VALUES ('{module_code}', '{semester}', '{name}',\
            '{weightage}', '{type}', '{group_or_indv}',\
                '{start_date}', '{due_date}', '{level_code}')\
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
    # provides mapping for level of the module as we need that for prediction
    level_mapping = {
        '1' : 'level_1k',
        '2' : 'level_2k',
        '3' : 'level_3k',
        '4' : 'level_4k'
    }


    response = request.json['params']
    # just need something to identify the change
    original_name = response['original_name']
    module_code = response['module_code']
    semester = response['semester']
    name = response['name']
    weightage = response['weightage']
    type = response['type']
    group_or_indv = response['group_or_indv']
    start_date = "" if response['start_date'] == "Invalid date" else response['start_date']
    due_date = response['due_date']
    # search for the first value that is an integer and map to the module level
    level_value = module_code[re.search(r'\d', module_code).start()]
    level_code = level_mapping[level_value]

    query = f"\
        UPDATE Assignments\
        SET [Name] = '{name}', [Weightage] = '{weightage}',\
        [Type]='{type}', [Group or Individual]='{group_or_indv}',\
        [Start Date]='{start_date}', [Due Date]='{due_date}', [Level] = '{level_code}'\
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

@app.route('/delete_assignments', methods=['DELETE'])
# params: module_code, semester, name
# deletes an assignment
def delete_assignments():

    # we only need the following 3 values to uniquely identify an assignment and delete it
    module_code = request.args.get('module_code')
    semester = request.args.get('semester')
    name = request.args.get('name')

    query = f"\
        DELETE FROM Assignments\
        WHERE [Name] = '{name}' AND [Module Code] = '{module_code}'\
            AND [Semester]='{semester}'\
    "

    db = establish_sql_connection()
    cursor = db.cursor()

    # execute the query and commit it
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
        # compute the stress score for the assignment first
        assignment_score = indiv_score(
            current_dict['Weightage'], current_dict['Type'],
            current_dict['Group or Individual'],current_dict['Level'],
            (datetime.datetime.strptime(current_dict['Start Date'], '%d-%b-%y') if current_dict['Start Date'] else None),
            (datetime.datetime.strptime(current_dict['Due Date'], '%d-%b-%y') if current_dict['Due Date'] else None)
        )
        # aggregate it over the number of students taking both modules
        current_dict['stress_score'] = assignment_score * (current_dict['Count'] / module_count)
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
        current_dict['stress_score'] = indiv_score(
            current_dict['Weightage'], current_dict['Type'],
            current_dict['Group or Individual'],current_dict['Level'],
            (datetime.datetime.strptime(current_dict['Start Date'], '%d-%b-%y') if current_dict['Start Date'] else None),
            (datetime.datetime.strptime(current_dict['Due Date'], '%d-%b-%y') if current_dict['Due Date'] else None)
        )
        data.append(current_dict)

    cursor.close()
    db.close()

    return json.dumps(data, default=str)

@app.route("/module_list_assignments_instructor", methods=["GET"])
# params: semester, module_list, instructor
# given a semester and the list of modules, provide all the assignments for the list of modules for the instructor
def module_list_assignments_instructor():
    # get the relevant parameters
    semester = request.args.get('semester')
    instructor = request.args.get('instructor')
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
        FROM Instructors WHERE [Semester]='{semester}' AND [Instructor]='{instructor}') b\
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
        current_dict['stress_score'] = indiv_score(
            current_dict['Weightage'], current_dict['Type'],
            current_dict['Group or Individual'],current_dict['Level'],
            (datetime.datetime.strptime(current_dict['Start Date'], '%d-%b-%y') if current_dict['Start Date'] else None),
            (datetime.datetime.strptime(current_dict['Due Date'], '%d-%b-%y') if current_dict['Due Date'] else None)
        )
        data.append(current_dict)

    cursor.close()
    db.close()

    return json.dumps(data, default=str)

@app.route("/get_window_stresses", methods=["GET"])
# params: module_code, semester, name, weightage, assignment_type, group_or_indv, start_date, due_date
# given the relevant details about a module, compute the stress scores of the days -5, current_due_date, +7 days
def get_window_stresses():
    # module mapping is required for the module level
    level_mapping = {
        '1' : 'level_1k',
        '2' : 'level_2k',
        '3' : 'level_3k',
        '4' : 'level_4k'
    }
    # get the relevant arguments for the user input
    module_code = request.args.get('module_code')
    semester = request.args.get('semester')
    name = request.args.get('name')
    type = request.args.get('type')
    group_or_indv = request.args.get('group_or_indv')
    weightage = float(request.args.get('weightage'))
    start_date = request.args.get('start_date')
    due_date = request.args.get('due_date')
    # search for the first value that is an integer and map to the module level
    level_value = module_code[re.search(r'\d', module_code).start()]
    level_code = level_mapping[level_value]

    # establish the database connection
    db = establish_sql_connection()
    cursor = db.cursor()

    # extract the number of students taking the current module
    query1 = f"\
        SELECT [Count]\
        FROM student_counts\
        WHERE [Module Code] = '{module_code}' AND [Semester] ='{semester}'\
    "
    cursor.execute(query1)
    module_count = cursor.fetchall()[0][0] # store in a variable here

    # get all the assignments for the current module and its pairings
    query2 = f"\
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
                AND [Count] > 0 AND [Module 2] != '{module_code}')\
            UNION\
                (SELECT '{module_code}' AS [Module Code], '{module_count}' AS [COUNT])) b \
        ON (a.[Module Code] = b.[Module 1])\
        "

    cursor.execute(query2)
    result = cursor.fetchall()
    # extract the column names
    columns = [column[0] for column in cursor.description]
    # put the result into a dataframe, note that the generation is required as each row is a row object
    combined_df = pd.DataFrame((tuple(t) for t in result), columns = columns)
    # compute the stress score for each of the rows, making use of the backend model
    combined_df['stress_score'] = combined_df.apply(lambda x :
            indiv_score(
            x['Weightage'], x['Type'],
            x['Group or Individual'],x['Level'],
            (datetime.datetime.strptime(x['Start Date'], '%d-%b-%y') if x['Start Date'] else None),
            (datetime.datetime.strptime(x['Due Date'], '%d-%b-%y') if x['Due Date'] else None))
            * x['Count'] / module_count, axis=1) # note that we will also multiply by its relative proportion of students taking both modules
    
    # final data will be stored as {'date' : 'stress_score'}
    data = {}
    # convert the current due date to a date time object for ease of iteration, make it None if there is no start date
    start_date_datetime = None if start_date == "Invalid date" else datetime.datetime.strptime(start_date, '%d-%b-%y')
    # convert the current due date to a date time object for ease of iteration
    current_date = datetime.datetime.strptime(due_date, '%d-%b-%y')
    # delta is a helper to iterate through each of the days
    delta = datetime.timedelta(days = 1)

    # start with the -5 days first
    current_date -= 5 * delta
    for i in range(6): # inclusive of current date
        current_date_formatted = current_date.strftime('%d-%b-%y')
        # check if the current_date is before the start_date, if it is then we do not give any scores for it
        if (start_date_datetime != None and (current_date-start_date_datetime).days < 0):
            data[current_date_formatted] = "Before start date"
        else:
            current_task_score = 0
            # check if it is the original task 
            current_day_task = combined_df[np.logical_and(np.logical_and(combined_df['Module Code'] == module_code, combined_df['Name'] == name), combined_df['Due Date'] == current_date.strftime('X%d-%b-%y').replace('X0', 'X').replace('X', ''))]
            # if there is the task, we add the score
            if (len(current_day_task) == 1):
                current_task_score += sum(current_day_task['stress_score'])


            # if the date we are considering is after the start_date, we get the current day cumulative score first
            current_day_score = sum(combined_df[combined_df['Due Date'] == current_date.strftime('X%d-%b-%y').replace('X0', 'X').replace('X', '')]['stress_score']) - current_task_score

            # compute the stress score of the assignment on this day and add it to the current count of the scores
            current_day_score += indiv_score(weightage, type, group_or_indv, level_code, start_date_datetime, current_date)

            # input the value into the data object
            data[current_date_formatted] = current_day_score

        current_date += delta # bring back by 1 day

    # now for the +7 days
    current_date = datetime.datetime.strptime(due_date, '%d-%b-%y')
    for i in range(7):
        current_date += delta # move to the next day
        current_date_formatted = current_date.strftime('%d-%b-%y')

        current_task_score = 0
        # check if it is the original task 
        current_day_task = combined_df[np.logical_and(np.logical_and(combined_df['Module Code'] == module_code, combined_df['Name'] == name), combined_df['Due Date'] == current_date.strftime('X%d-%b-%y').replace('X0', 'X').replace('X', ''))]
        # if there is the task, we add the score
        if (len(current_day_task) == 1):
            current_task_score += sum(current_day_task['stress_score'])

        # compute the cumulative score for the day first
        current_day_score = sum(combined_df[combined_df['Due Date'] == current_date.strftime('X%d-%b-%y').replace('X0', 'X').replace('X', '')]['stress_score']) - current_task_score

        # compute the stress score of the assignment on this day and add it to the current count of the scores
        current_day_score += indiv_score(weightage, type, group_or_indv, level_code, start_date_datetime, current_date)

        # input the value into the data object
        data[current_date_formatted] = current_day_score

    cursor.close()
    db.close()
    considering_dates = list(filter(
        lambda kv : not isinstance(kv[1], str), data.items()))
    min_date = min(list(map(lambda x : x[1], considering_dates))) # finding the minimum stress day
    best_dates = list(map(lambda kv : kv[0], filter(lambda keyval : keyval[1] == min_date, considering_dates)))

    final_data = {
        'best_dates' : best_dates,
        'stress_scores' : data
    }

    return json.dumps(final_data, default=str)