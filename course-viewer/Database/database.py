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

@app.route("/get-assignments", methods=['GET'])
def get_assignments_table():

    db = establish_sql_connection()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM Assignments')
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

@app.route("/get-instructors", methods=['GET'])
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