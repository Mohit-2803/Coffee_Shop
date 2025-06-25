from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ---------------------------
# MongoDB Connection & Data Loading
# ---------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce"]  # Database name
views_collection = db["productviews"]  # Collection name for product views


def load_views_data():
    """
    Fetches product view data from MongoDB.
    Each document should have: userId, productId, and category.
    Returns a tuple:
      - DataFrame with columns: userId, productId, rating (implicit by counting views)
      - Raw DataFrame (for creating a product-to-category mapping)
    """
    # Fetch documents including category
    views_cursor = views_collection.find(
        {}, {"userId": 1, "productId": 1, "category": 1, "_id": 0}
    )
    views_list = list(views_cursor)

    # If no views are found, insert sample data with a category field.
    if not views_list:
        sample_data = [
            {"userId": "user1", "productId": "prodA", "category": "electronics"},
            {"userId": "user1", "productId": "prodB", "category": "electronics"},
            {"userId": "user2", "productId": "prodA", "category": "electronics"},
            {"userId": "user2", "productId": "prodC", "category": "electronics"},
            {"userId": "user3", "productId": "prodB", "category": "electronics"},
            {"userId": "user3", "productId": "prodC", "category": "electronics"},
        ]
        views_collection.insert_many(sample_data)
        views_list = sample_data
        print("Inserted sample product views into MongoDB.")

    # Create a DataFrame from the fetched data.
    df = pd.DataFrame(views_list)

    # Group by userId and productId to count views, using the count as an implicit rating.
    ratings = df.groupby(["userId", "productId"]).size().reset_index(name="rating")
    return ratings, df


# Load view data from MongoDB
data, df_raw = load_views_data()

# Create a mapping from productId to category using the raw DataFrame.
product_categories = (
    df_raw[["productId", "category"]]
    .drop_duplicates()
    .set_index("productId")["category"]
    .to_dict()
)

# ---------------------------
# Preprocessing & Collaborative Filtering
# ---------------------------
# Build a user-product interaction matrix (rows: users, columns: products).
user_product_matrix = data.pivot_table(
    index="userId", columns="productId", values="rating", fill_value=0
)

# Transpose the matrix so that rows represent products (for item-based filtering).
product_matrix = user_product_matrix.T

# Compute cosine similarity between products.
similarity_matrix = cosine_similarity(product_matrix)

# Convert the similarity matrix to a DataFrame for easy lookup.
similarity_df = pd.DataFrame(
    similarity_matrix, index=product_matrix.index, columns=product_matrix.index
)


def get_similar_products(product_id, top_n=5, product_category=None):
    """
    Returns a list of top_n product IDs similar to the given product_id,
    but only those that belong to the same product_category.
    """
    if product_id not in similarity_df.index:
        return []

    # Get similarity scores for the given product (exclude itself).
    similar_products = (
        similarity_df[product_id].drop(product_id).sort_values(ascending=False)
    )

    # If a category is specified, filter out products that don't match.
    if product_category:
        similar_products = similar_products[
            similar_products.index.map(
                lambda pid: product_categories.get(pid) == product_category
            )
        ]
    return similar_products.head(top_n).index.tolist()


# ---------------------------
# API Endpoint
# ---------------------------
@app.route("/api/recommendations/<product_id>", methods=["GET"])
def recommend(product_id):
    if not product_id:
        return jsonify({"error": "productId parameter required"}), 400

    product_category = product_categories.get(product_id)
    recommendations = get_similar_products(
        product_id, top_n=7, product_category=product_category
    )
    return jsonify({"recommendedProducts": recommendations})


# ---------------------------
# Run the Flask App
# ---------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)
