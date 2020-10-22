//https://hub.packtpub.com/building-movie-api-express/
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routers/actor');
const movies = require('./routers/movie');
const path = require('path');

const app = express();

app.listen(8080);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//tell express to serve week9Ang
app.use("/", express.static(path.join(__dirname, "dist/movieang"))); //NEW

mongoose.connect('mongodb://localhost:27017/movies',{useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});

//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);

//Lab Week 7
app.delete('/actors/:id/deletemovies', actors.deleteActorAndMovies);
app.delete('/actors/:actorid/movies/:movieid', actors.removeMovie);

//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);

//Lab Week 7
app.delete('/movies/:id', movies.deleteOne);
app.delete('/movies/:movieid/actors/:actorid', movies.removeActor);
app.post('/movies/:id/actors', movies.addActor);
app.get('/movies/:year1/:year2', movies.getByYear);
app.post('/movies/deletebyyear', movies.deleteByYear);
app.get('/actorsByMoviesYear/:year', movies.ActorMovieByYear);