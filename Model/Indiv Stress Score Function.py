import pandas as pd

class Assignment:
    max_stress = 3.73

    weights = {
    "level": {
        "level_1k": 0.1,
        "level_2k": 0.2,
        "level_3k": 0.3,
        "level_4k": 0.4
        },
    "i_or_g": {
        "I": 0.3,
        "G": 0.4,
        "I&G": 0.3
        },
    "type": {
        "Presentation": 0.1,
        "Project": 0.25,
        "Participation": 0.05,
        "Quiz": 0.1,
        "Assignment": 0.15,
        "Exam": 0.35
        },
    "gap": {
        "One Week": 0.4,
        "Two Weeks": 0.3,
        "More Than Two Weeks": 0.15,
        "Others": 0.15 # assume weight to be 0.15 if gap is not known eg. start date is NA
        }
    }

    def __init__(self, weightage, assignment_type, i_g, level, start_date=None, due_date=None):
        self.weightage = weightage
        self.assignment_type = assignment_type
        self.i_g = i_g
        self.level = level
        self.start_date = start_date
        self.due_date = due_date

    def normalized_score(self, score):
        return (score)/(Assignment.max_stress)*10

    def get_gap(self):
        if pd.isnull(self.start_date):
            return "Others"
        else:
            gap = (self.due_date - self.start_date).days
            if gap <= 7:
                return "One Week"
            elif gap <= 14:
                return "Two Weeks"
            else:
                return "More Than Two Weeks"

    def indiv_score(self):
        gap = self.get_gap()
        stress_score = self.weightage/100 + Assignment.weights['type'][self.assignment_type]*3 + Assignment.weights['i_or_g'][self.i_g]*2 + Assignment.weights['level'][self.level]*1 + Assignment.weights['gap'][gap]*4
        normalized_stress = self.normalized_score(stress_score)
        return normalized_stress
