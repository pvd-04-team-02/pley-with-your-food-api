<h3>FoodSens Restaurant Rating Application</h3>

Project designed by: Sue Fakunle, Seyi Solanke, Eli Wellington, Nathan Bissell.
For project three at General Assembly, we created a single page application called "Pley With Your Food", that takes restaurants allows users to leave ratings and comments.

<h3>Installation</h3>

our application required an express API template provided by General Assembly.
<a href="https://git.generalassemb.ly/ga-wdi-boston/express-api-template"></a>

Express required us to create a mongoose database in which to create our backend. Downloading this template (not forking and cloning) allowed us to then unzip and create the repository via Github.

On sign up, a user has the ability to enter their email, password, and also gives them an option to sign up as a Restaurant Owner. If they choose to do so, they will be able to add their own restaurant to the database.

A User will be able to log in, and see a list of restaurants and view the rating and the comments left by other users. Whereas, a restaurant owner (Admin) will be able to view comments and ratings that other users have left on their restaurant.

Normal users will be able to create comments, create ratings, and show their ratings. They will also be able to delete their ratings and comments or update them at any given point.

Admin users (restaurant owners) will be able to view their restaurant's ratings and comments (read access) but not able to alter, given that normal users should be protected against the abuse of power that restaurant owners might implement if they are able to delete comments that negatively reflect their restaurant.

Users are allowed to do all authenticated actions such as <b>sign in, sign up, change password, and sign out</b>
A User can either be a restaurant owner or a normal user (determined by a boolean value contained when the user creates an account), and by choosing one of these options they get different CRUD actions referenced by different models in the backend. <b>Owners</b> references the Restaurant table, whereas <b>Users</b> references the ratings model.

the Restaurant model requires:
-name
-address
-owner ID

the Ratings model requires:
-rate
-address
-comments
-restaurant ID
-owner ID


A user has many reviews, and a restaurant has many reviews. In this case, Ratings was the join table between these two classes.

Our biggest issues when dealing with the backend was determining which parameters to pass it when calling our API. We also had to rewrite our restaurant_routes in order to make sure that the user that was editing the restaurant actually owned it.

Restaurant Routes:
<br>
-GET (all): '/restaurants'
<br>
-GET (one): '/restaurants/:id'
<br>
-POST: '/restaurants'
<br>
-PATCH: '/restaurants/:id'
<br>
-DELETE: '/restaurants/:id'
<br>

Rating Routes:
<br>
-GET (all): '/ratings'
<br>
-GET (one): '/ratings/:id'
<br>
-POST: '/ratings'
<br>
-PATCH: '/ratings/:id'
<br>
-DELETE: '/ratings/:id'
<br>

User Routes:
<br>
-POST: '/sign-up'
<br>
-POST: '/sign-in'
<br>
-PATCH: '/change-password'
<br>
-DELETE: '/sign-out'
<br>

<a href="https://imgur.com/Qprn46g"><img src="https://i.imgur.com/Qprn46g.jpg" title="source: imgur.com" />Entity Relationship Diagram</a>

<a href="https://pvd-04-team-02.github.io/pley-with-your-food-client/"/> FoodSens Link to Frontend</a>
<a href="https://sleepy-river-78399.herokuapp.com"/> FoodSens Link to Backend</a>

<br><b>
  Process: Our Scrum master, Seyi, held our morning standups at approximately 9:15 AM EST. Seyi and Nathan worked primarily on our frontend, while Eli and Sue worked on the backend. Our initial backend was scaffolded using Shawn's scaffolding program. We used Trello to prioritize our tasks during operational hours. We used our standup in the morning to delegate those tasks, and to design our overall code push and daily goals of what we expected to do, with the hours that we allocated for a specific task or feature. When we began testing our UI, we hooked my windows laptop to the television located in the classroom and we ran live demo's with the pulled code from our repository. From there we would use VS code's liveshare plugin, and all link to one repository. From there, we would use my laptop to break the site or show features, and then save and demo those changes on my machine. If the changes were successful, we would then commit and push up to our repository. We worked in pairs for the first couple of days, and once we had a functionanl site with CRUD actions that needed to be tested, we worked for the last two or three days with VScode liveshare.
