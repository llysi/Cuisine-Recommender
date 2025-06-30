import pandas as pd 

data = pd.read_csv('../data/cleaned_cuisines.csv')
data.head()

# Remove unnecessary columns, save remaining data as 'X'
X = data.iloc[:,2:]
X.head()

# Save labels as 'y'
y = data[['cuisine']]
y.head()