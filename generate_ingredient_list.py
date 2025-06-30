import pandas as pd
import json

df = pd.read_csv('./data/cleaned_cuisines_dropped.csv')

ingredient_cols = df.columns.drop(['cuisine', 'Unnamed: 0'], errors='ignore')
ingredients = [{"ingredient": name, "index": i} for i, name in enumerate(ingredient_cols)]
print(len(ingredient_cols))
print(df.columns)

with open("ingredients.json", "w") as f:
    json.dump(ingredients, f, indent=2)

print("ingredients.json generated!")
