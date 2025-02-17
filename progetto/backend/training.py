from sklearn.model_selection import train_test_split
import numpy as np

# Dataset di esempio
emails = ["Meeting at 5 PM", "Invoice for services", "Family dinner invitation"]
labels = [0, 1, 2]  # 0 = lavoro, 1 = finanza, 2 = personale

X_train, X_test, y_train, y_test = train_test_split(emails, labels, test_size=0.2)

X_train = [preprocess_email(email) for email in X_train]
X_test = [preprocess_email(email) for email in X_test]

model.fit(np.array(X_train), np.array(y_train), epochs=10, batch_size=4)

accuracy = model.evaluate(np.array(X_test), np.array(y_test))
print(f"Accuratezza: {accuracy[1]}")