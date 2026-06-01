from auth import (
    hash_password,
    verify_password,
    create_access_token,
    fake_users_db
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse

import joblib

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from datetime import datetime
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://dna-mutation-analysis-platform.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("dna_mutation_model.pkl")


class MutationInput(BaseModel):
    mutation_type: str
    gene_symbol: str


class UserAuth(BaseModel):
    username: str
    password: str


@app.get("/")
def home():
    return {
        "message": "DNA Mutation Classifier API Running"
    }


@app.post("/predict")
def predict(data: MutationInput):

    features = data.mutation_type + " " + data.gene_symbol

    prediction = model.predict([features])[0]

    probabilities = model.predict_proba([features])[0]

    confidence = max(probabilities) * 100

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }


@app.post("/download-report")
def download_report(data: MutationInput):

    features = data.mutation_type + " " + data.gene_symbol

    prediction = model.predict([features])[0]

    probabilities = model.predict_proba([features])[0]

    confidence = round(max(probabilities) * 100, 2)

    pdf_file = "dna_mutation_report.pdf"

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(pdf_file)

    content = [
        Paragraph(
            "DNA Mutation Classification Report",
            styles["Title"]
        ),

        Spacer(1, 30),

        Paragraph(
            f"Mutation Type: {data.mutation_type}",
            styles["Normal"]
        ),

        Paragraph(
            f"Gene Symbol: {data.gene_symbol}",
            styles["Normal"]
        ),

        Paragraph(
            f"Prediction: {prediction}",
            styles["Normal"]
        ),

        Paragraph(
            f"Confidence: {confidence}%",
            styles["Normal"]
        ),
    ]

    doc.build(content)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="dna_mutation_report.pdf"
    )


@app.post("/register")
def register(user: UserAuth):

    if user.username in fake_users_db:
        return {
            "message": "User already exists"
        }

    hashed_password = hash_password(user.password)

    fake_users_db[user.username] = {
        "username": user.username,
        "password": hashed_password
    }

    return {
        "message": "User registered successfully"
    }


@app.post("/login")
def login(user: UserAuth):

    db_user = fake_users_db.get(user.username)

    if not db_user:
        return {
            "message": "User not found"
        }

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        return {
            "message": "Invalid password"
        }

    token = create_access_token(
        {"sub": user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@app.post("/login")
def login(user: UserAuth):

    db_user = fake_users_db.get(user.username)

    if not db_user:
        return {"message": "Invalid username"}

    if not verify_password(user.password, db_user["password"]):
        return {"message": "Invalid password"}

    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }