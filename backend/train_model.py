import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

df = pd.read_csv("cleaned_variants.csv")

# combine features
df["features"] = df["Type"] + " " + df["GeneSymbol"]

X = df["features"]
y = df["ClinicalSignificance"]

# split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])

# train
model.fit(X_train, y_train)

# predict
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# save model
joblib.dump(model, "dna_mutation_model.pkl")

print("Model saved successfully!")