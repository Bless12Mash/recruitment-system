import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Set constants from the codebase
ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager"
]

LEVELS = ["Junior", "Mid", "Senior", "Lead"]

PROGRESS = ["Hired", "Rejected", "On Hold", "Shortlisted", "Pending", "Offered", "Offer Accepted", "Offer Rejected"]

# Generate 500 candidates
num_candidates = 10
candidates = []

for _ in range(num_candidates):

    candidate = {
        'name': fake.name(),
        'email': fake.email(),
        'role': np.random.choice(ROLES),
        'level': np.random.choice(LEVELS),
        'progress': np.random.choice(PROGRESS),
        'createdBy': fake.name(),
        'location': fake.city(),
    }
    candidates.append(candidate)

df = pd.DataFrame(candidates)
df.to_excel('mock_candidates.xlsx', index=False)
print(f"Generated {num_candidates} mock candidates and saved to mock_candidates.xlsx")
