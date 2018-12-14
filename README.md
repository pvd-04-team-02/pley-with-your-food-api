
Project designed by: Sue Fakunle, Seyi Solanke, Eli Wellington, Nathan Bissell.
For project three at General Assembly, we created a single page application called "Pley With Your Food", that takes restaurants allows users to leave ratings and comments.

On sign up, a user has the ability to enter their email, password, and also gives them an option to sign up as a Restaurant Owner. If they choose to do so, they will be able to add their own restaurant to the database.

A User will be able to log in, and see a list of restaurants and view the rating and the comments left by other users. Whereas, a restaurant owner (Admin) will be able to view comments and ratings that other users have left on their restaurant.

Normal users will be able to create comments, create ratings, and show their ratings. They will also be able to delete their ratings and comments or update them at any given point.

Admin users (restaurant owners) will be able to view their restaurant's ratings and comments (read access) but not able to alter, given that normal users should be protected against the abuse of power that restaurant owners might implement if they are able to delete comments that negatively reflect their restaurant.

Our front-end uses Javascript and incorporates bootstraps, modals for the restaurant view pages, and incorporates the handlebars template system for displaying data. Our backend was designed with a Mongodb database and used a many to many relation between Users, Reviews, and Restaurants

A user has many reviews, and a restaurant has many reviews. In this case, Reviews was the join table between these two classes.
