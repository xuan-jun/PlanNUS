import pandas as pd

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

def normalized_score(score):
    return (score)/(3.73)*10

def get_gap(due_date, start_date):
    if not start_date:
        return "Others"
    else:
        gap = (due_date - start_date).days
        if gap <= 7:
            return "One Week"
        elif gap <= 14:
            return "Two Weeks"
        else:
            return "More Than Two Weeks"

def indiv_score(weightage, assignment_type, i_g, level, start_date, due_date):
    gap = get_gap(due_date, start_date)
    stress_score = weightage/100 + weights['type'][assignment_type]*3 + weights['i_or_g'][i_g]*2 + weights['level'][level]*1 + weights['gap'][gap]*4
    normalized_stress = normalized_score(stress_score)
    return normalized_stress