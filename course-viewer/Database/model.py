import pandas as pd
import numpy as np

weights = {
    "level": {
        "level_1k": 0.4,
        "level_2k": 0.8,
        "level_3k": 1.2,
        "level_4k": 1.6
    },
    "i_or_g": {
        "I": 0.3,
        "G": 0.4,
        "I&G": 0.3
    },
    "type": {
        "Presentation": 0.6,
        "Project": 0.8,
        "Participation": 0.2,
        "Quiz": 0.2,
        "Assignment": 0.5,
        "Exam": 1
    },
    "gap": {
        "One Week": 0.8,
        "Two Weeks": 0.6,
        "More Than Two Weeks": 0.4,
        "Others": 0.4 # assume weight to be 0.15 if gap is not known eg. start date is NA
    }
}

def normalized_score(score):
    max_stress = 2/(1+np.exp(-0.05*70+2)) + 1.6 + 0.4 + 1 + 0.8
    return (score)/(max_stress)*10

def get_gap(due_date, start_date):
    if pd.isnull(start_date):
        return "Others"
    else:
        gap = (due_date - start_date).days
        if gap <= 7:
            return "One Week"
        elif gap <= 14:
            return "Two Weeks"
        else:
            return "More Than Two Weeks"

def indiv_score(weightage, assignment_type, i_g, level, start_date=None, due_date=None):
    gap = get_gap(due_date, start_date)
    stress_score = 2/(1+np.exp(-0.05*weightage+2)) + weights['type'][assignment_type] + weights['i_or_g'][i_g] + weights['level'][level] + weights['gap'][gap]
    normalized_stress = normalized_score(stress_score)
    return normalized_stress