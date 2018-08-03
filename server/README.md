# VocabTrainerServer


This git project is a deployment project of vocabTrainer on heroku server.
The project is a combination of vocabTrainer-server and vocabTrainer-client project.

This project is deployed on heroku server and MONGOLAb ass a database server.
Both accounts on heroku and mongolab are created separately through gmail.

node is running on 1 dyno and mongolab on sandbox mode which are free of cost.

DBCOnection:
For db connection, get a db connection URI from mongolab and set environment variable in heroku
FOR EXAMPLE
 process.env.MONGOLAb_URI:mongodb://dbuser:dbpassword@ds059957.mongolab.com:59957/loc8r-dev 
 
 also set envorinment variable for client base url
 process.env.SERVER_URI= https://aqueous-sierra-9599.herokuapp.com/