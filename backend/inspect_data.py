import pandas as pd

df = pd.read_csv("../dataset/variant_summary.txt", sep="\t")

print("Shape:", df.shape)
print("\nColumns:\n", df.columns.tolist())
print("\nClinical Significance:\n")
print(df["ClinicalSignificance"].value_counts().head(20))
print("\nSample rows:\n")
print(df.head())