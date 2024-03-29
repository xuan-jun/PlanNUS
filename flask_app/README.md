# Flask App API Endpoints

1. Run `docker compose up -d` to spin up a composed container. There should be 2 containers that will be created

    - *mssql_container*: This is created from `ddalgiie/courses-db` image. This will be where the data is stored. It will be serving at localhost:1433
      
    - *flask_container* : This is where the flask app will be processing the API request made from our front end server. It will be serving at localhost:4000. It has been configured to communicate with the *mssql_container* at the relevant TCP ports

2. Ensure that the docker compose container is running properly. Else it could be due to one of the ports being used so you can stop the other containers first. Else, it could also be due to the image you pulled being old. Therefore, try to delete the image locally first and repull

3. Run `npm start` on your machine to load the front end website. You can test if it is working by logging in with the relevant instructor's email and password

## Endpoint Descriptions

---

`establish_sql_connection()` - This is just a helper function that is configured to connect with the *mssql_container* that we have created

---

**Endpoint**: `'/token'`, **method** = `POST`

Description: Checks if the email and password combination is correct. Will check against our database. Returns `access_token` and `name`

* params:
    
    - `email` : Email address of the instructor logging in
    - `password` : Password of the instructor logging in

* return:

    - In the `json` return object:
      
      - `access_token` : access token for the user
      - `name` : name of the instructor that is logged in


```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'email' : 'vik.gopal@nus.edu.sg',
    'semester' : 'password1'
   }
   axios.get('/token', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---

**Endpoint**: `'/logout'`, **method** = `POST`

Description: Allows for the user to log out and we can remove the access token

* params:
    
    - `None`

* return:

    - No return value

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   axios.post('/logout')
    .then((response) => {
    // note that there is no response.data here but you can check the status code
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---

**Endpoint**: `'/get_assignments'`, **method** = `GET`

Description: Given a `module_code` and `semester`, returns a json object containing all the assignments currently recorded for the module.

* params:
    
    - `module_code` : Module Code that we are trying to get the assignment for
    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

* return:

    - In the `json` return object, each object will consist of:
      
      - `Module Code` : Module code for the assignment
      - `Semester` : Semester that we are concerned with
      - `Name` : Name of the assignment
      - `Weightage` : Weightage of the assignment
      - `Type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
      - `Group or Individual` : Whether it is a group or individual presentation. ['I', 'G']
      - `Start Date` : Start date of the assignment
      - `Due Date` : Due Date of the assignment
      - `Level` : Level of the module. [level_1k, level2k, level_3k, level4k]
      - `stress_score` : Stress score of the assignment, will make a call with `indiv_score()` from backend model

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'module_code' : 'DSA3101',
    'semester' : '2220'
   }
   axios.get('/get_assignments', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---
**Endpoint**: `'/add_new_assignments'`, **method** = `POST`

Description: Given an assignment with the relevant parameters, adds the assignment into the database

* params:
    
    - `module_code` : Module code for the assignment
    - `semester` : Semester that we are concerned with
    - `name` : Name of the assignment
    - `weightage` : Weightage of the assignment
    - `type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
    - `group_or_indv` : Whether it is a group or individual presentation. ['I', 'G']
    - `start_date` : Start date of the assignment
    - `due_date` : Due Date of the assignment

* return:

    - No return value

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

  useEffect(() => {
    const params = {
      'module_code' : 'DSA3101',
      'semester' : '2220',
      'name' : 'Assignment 2 Docker',
      'weightage' : 10,
      'type' : 'Assignment',
      'group_or_indv' : 'Individual',
      'start_date' : '23 Mar 2023',
      'due_date' : '1 Apr 2023'
    }
    axios.post('/add_new_assignments', {params})
      .then((response) => {
        // note that there is no response.data here but you can check the status code
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

```

---

**Endpoint**: `'/update_assignments'`, **method** = `PUT`

Description: Given the original name of the assignment and updated parameters of a full assignment, update the details of the assignment into the database

* params:
    
    - `original_name` : Original name of the assignment that is previously stored in the database. Could be the same name now as well
    - `module_code` : Module code for the assignment
    - `semester` : Semester that we are concerned with
    - `name` : Name of the assignment after update. Could be the same as `original_name` but pass it as 2 params
    - `weightage` : Weightage of the assignment
    - `type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
    - `group_or_indv` : Whether it is a group or individual presentation. ['I', 'G']
    - `start_date` : Start date of the assignment
    - `due_date` : Due Date of the assignment

* return:

    - No return value

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

  useEffect(() => {
    const params = {
      'module_code' : 'DSA3101',
      'semester' : '2220',
      // note that this is important and different from adding new assignment
      'original_name' : 'Assignment 2 Docker',
      'name' : 'Assignment 3 Docker',
      'weightage' : 20,
      'type' : 'Assignment',
      'group_or_indv' : 'Individual',
      'start_date' : '23 Mar 2023',
      'due_date' : '3 Apr 2023'
    }
    axios.put('/update_assignments', {params})
      .then((response) => {
        // note that there is no response.data here but you can check the status code
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

```

---

**Endpoint**: `'/delete_assignments'`, **method** = `DELETE`

Description: Given the Module Code, Semester and name of the assignment, we will remove it from the database

* params:
    
    - `module_code` : Module code for the assignment
    - `semester` : Semester that we are concerned with
    - `name` : Name of the assignment

* return:

    - No return value

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

  useEffect(() => {
    // note that we pass it in as body
    const params = {
      'module_code' : 'DSA3101',
      'semester' : '2220',
      'name' : 'Assignment 3 Docker',
    }
    axios.delete('/delete_assignments', {params})
      .then((response) => {
        // note that there is no response.data here but you can check the status code
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

```

---
**Endpoint**: `'/get_assignment_pairings'`, **method** = `GET`

Description: Given a `module_code` and `semester`, returns a json object containing all the assignments of other modules whereby there is at least 1 student taking from the current module.

* params:
    
    - `module_code` : Module Code that we are trying to get the assignment for
    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

* return:

    - In the `json` return object, each object will consist of the following (Note that it is of the module pairings, does not contain the current module's assignments, please call `get_assignments` instead if you need that data):
      
      - `Module Code` : Module code for the assignment
      - `Semester` : Semester that we are concerned with
      - `Name` : Name of the assignment
      - `Weightage` : Weightage of the assignment
      - `Type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
      - `Group or Individual` : Whether it is a group or individual presentation. ['I', 'G']
      - `Start Date` : Start date of the assignment
      - `Due Date` : Due Date of the assignment
      - `Level` : Level of the module. [level_1k, level2k, level_3k, level4k]
      - `stress_score` : Stress score of the assignment. Note that this is already aggregated over the number of students from this module taking that other module. (num_pairwise_students)/(total_students_taking_current_module) * (stress_score_from_this_assignment). Calculation of its original stress score is given by making a call with `indiv_score()` from backend model
      - `Instructor` : Instructor that is teaching the module
      - `Email` : Email of the instructor teaching the module

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'module_code' : 'DSA3101',
    'semester' : '2220'
   }
   axios.get('/get_assignment_pairings', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```


---

**Endpoint**: `'/get_instructors'`, **method** = `GET`

Description: Returns the list of which instructors are teaching which modules.

* params:
    
    - None

* return:

    - In the `json` return object, each object will consist of the following:
      
      - `Days and Times` : Day and timing of the module lecture timing
      - `Instructor` : Name of the instructor that is teaching the module
      - `Semester` : Semester that the module is conducted
      - `Module Code` : Module code of the module

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   axios.get('/get_instructors')
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---


**Endpoint**: `'/modules_for_instructor'`, **method** = `GET`

Description: Given a `instructor` and `semester`, returns a list of the modules that the instructor is teaching

* params:
    
    - `instructor` : Name of instructor that we are concerned with
    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

* return:

    - In the `json` return object with the [Module Code] of the modules
      
      - `Module Code` : Module code for the assignment

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'instructor' : 's/o Gopal Vikneswaran',
    'semester' : '2220'
   }
   axios.get('/modules_for_instructor', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---

**Endpoint**: `'/modules_for_semester'`, **method** = `GET`

Description: Given a `semester`, returns a list of the modules that are available

* params:

    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

* return:

    - In the `json` return object with the [Module Code] of the modules
      
      - `Module Code` : Module code for the assignment

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'semester' : '2220'
   }
   axios.get('/modules_for_semester', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```


---

**Endpoint**: `'/module_list_assignments'`, **method** = `GET`

Description: Given a `semester`, `module_list`, returns the list of assignments that the modules in `module_list` assigned for that semester

* params:
    - `module_list` : Array list of module codes

      - E.g. ['DSA3101', 'DSA3102']

    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

* return:

      - `Module Code` : Module code for the assignment
      - `Semester` : Semester that we are concerned with
      - `Name` : Name of the assignment
      - `Weightage` : Weightage of the assignment
      - `Type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
      - `Group or Individual` : Whether it is a group or individual presentation. ['I', 'G']
      - `Start Date` : Start date of the assignment
      - `Due Date` : Due Date of the assignment
      - `Level` : Level of the module. [level_1k, level2k, level_3k, level4k]
      - `stress_score` : Stress score of the assignment, will make a call with `indiv_score()` from backend model
      - `Instructor` : Instructor teaching the module
      - `Email` : Email of the instructor teaching the module

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'semester' : '2220',
    'module_list' : ['DSA3101', 'DSA3102']
   }
   axios.get('/module_list_assignments', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---

**Endpoint**: `'/module_list_assignments-instructor`, **method** = `GET`

Description: Given a `semester`, `module_list`,`instructor` returns the list of assignments that the modules in `module_list` assigned for that `semester` for that `instructor`

* params:
    - `module_list` : Array list of module codes

      - E.g. ['DSA3101', 'DSA3102']

    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

    - `instructor` : Instructor teaching the module

* return:

      - `Module Code` : Module code for the assignment
      - `Semester` : Semester that we are concerned with
      - `Name` : Name of the assignment
      - `Weightage` : Weightage of the assignment
      - `Type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
      - `Group or Individual` : Whether it is a group or individual presentation. ['I', 'G']
      - `Start Date` : Start date of the assignment
      - `Due Date` : Due Date of the assignment
      - `Level` : Level of the module. [level_1k, level2k, level_3k, level4k]
      - `stress_score` : Stress score of the assignment, will make a call with `indiv_score()` from backend model
      - `Instructor` : Instructor teaching the module
      - `Email` : Email of the instructor teaching the module

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

useEffect(() => {
   const params = {
    'semester' : '2220',
    'module_list' : ['DSA3101', 'DSA3102'],
    'instructor' : 's/o Gopal Vikneswaran'
   }
   axios.get('/module_list_assignments_instructor', {params})
    .then((response) => {
    // the relevant data is in response.data so you can have a useState() to store it
      console.log(response.data) 
    })
    .catch((err) => {
      console.log(err)
    })
 }, [])
```

---
**Endpoint**: `'/get_window_stresses'`, **method** = `GET`

Description: Given details about the new assignment and also the `module_code` and `semester` of the current module, compute a window of stresses if the assignment is placed on that day.

* params:
    
    - `module_code` : Module Code that we are trying to get the assignment for
    - `semester` : Semester that we are considered with. It is in the format of `AYS0`
      
      - AY - Is the starting year for the academic year. (i.e. If it is AY22/23 it will be 22 in this case)
      - S - Semester that we are in. If it is semester 1 it is 1 and semester 2 is 2.

    - `module_code` : Module code for the assignment
    - `semester` : Semester that we are concerned with
    - `name` : Name of the assignment
    - `weightage` : Weightage of the assignment
    - `type` : Type of assignment [Assignment, Exam, Participation, Presentation, Project, Quiz]
    - `group_or_indv` : Whether it is a group or individual presentation. ['I', 'G']
    - `start_date` : Start date of the assignment
    - `due_date` : Due Date of the assignment

* return:

    - In the `json` return object, it will contain 2 different keys,
      
      - `best_dates` - Date(s) with the minimum score across the 13 day window
      - `stress_scores` - Stress scores for the 13 day window. For instance, 

      - Example: if we have `start_date` = '10-Apr-23' and `due_date` = '14-Apr-23'. We will check for all dates between ['9-Apr-23', '21-Apr-23'] since this is a 13 day window.
        - For '9-Apr-23', its value will be **"Before start date"** and no stress score will be given because the due date will be before the start date
        - For the rest of the days, stress scores are computed as such:
          - We will find all the assignments for the currnet module and the module pairs on that due date. Find the relative stress scores of each of the assignments (i.e. Number of students taking both / Number of students taking the module we are concerned with * stress_score of assignment) Note that if it is the currnet module's assignment, we can just get the value of it as it is without aggregation
          - Compute the score of the new assignment on that due_date with the other parameters
          - Sum across all the stress scores and that it is the stress score recorded
          - E.g. ('14-Apr-23', 27.5)

* **Example Call**:

```javascript
import axios from 'axios'
import { useEffect } from 'React'

  useEffect(() => {
    const params = {
      'module_code' : 'DSA3101',
      'semester' : 2220,
      'name' : 'Assignment 5',
      'type' : 'Project',
      'group_or_indv': 'I',
      'weightage': 20,
      'start_date': '10-Apr-23',
      'due_date': '14-Apr-23'
    }
    axios.get('/get_window_stresses', {params})
      .then((response) => {
        const data = response.data
        // can store it in some state to use, this is the best dates
        console.log(data['best_dates'])
        // can store it in some state to use, this are all the stress scores
        console.log(data['stress_scores'])
      })
      .catch((err) => console.log(err));
  }, [])
```