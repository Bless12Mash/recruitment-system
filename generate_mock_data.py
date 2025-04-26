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
num_candidates = 500
candidates = []

for _ in range(num_candidates):
    created_at = fake.date_time_between(start_date='-60d', end_date='+90d')
    updated_at = fake.date_time_between(start_date=created_at, end_date='+90d')

    candidate = {
        'name': fake.name(),
        'email': fake.email(),
        'role': np.random.choice(ROLES),
        'level': np.random.choice(LEVELS),
        'progress': np.random.choice(PROGRESS),
        'createdBy': fake.name(),
        'location': fake.city(),
        'createdAt': created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updatedAt': updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
    candidates.append(candidate)

df = pd.DataFrame(candidates)
df.to_excel('mock_candidates.xlsx', index=False)
print(f"Generated {num_candidates} mock candidates and saved to mock_candidates.xlsx")
