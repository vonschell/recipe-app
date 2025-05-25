import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
db = SQLAlchemy(app)

# Define the Recipe model
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.String(500), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    description = db.Column(
        db.Text,
        nullable=True,
        default='Delicious. You need to try it!'
    )
    image_url = db.Column(
        db.String(500),
        nullable=True,
        default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    )
    servings = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return (
            f"Recipe(id={self.id}, title='{self.title}', "
            f"description='{self.description}', servings={self.servings})"
        )

# Initialize the database
# with app.app_context():
#     db.create_all()
#     db.session.commit()
    
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():     
    recipes = Recipe.query.all()     
    recipe_list = []     
    for recipe in recipes:         
        recipe_list.append({             
            'id': recipe.id,             
            'title': recipe.title,             
            'ingredients': recipe.ingredients,             
            'instructions': recipe.instructions,             
            'description': recipe.description,             
            'image_url': recipe.image_url,             
            'servings': recipe.servings         
        })     
    return jsonify(recipe_list)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
