var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    //Lab Week 7
    deleteOne: function (req, res) {
        let movieID = req.params.id;

        Movie.findOne({ _id: movieID}, function (err, movie) {
            if (movie.actors.length != 0){
                for (let i = 0; i < movie.actors.length; i++){
                    Actor.findOne({ _id: movie.actors[i] }, function (err, actor) {
                        for (let j = 0; j < actor.movies.length; j++){
                            if (movieID == actor.movies[j]){
                                actor.movies.splice(j,1);
                                break;
                            }
                        }
                        Actor.updateOne({'_id': actor._id}, { $set: { 'movies' : actor.movies } }, function (err,result){
                            if (err) res.json(err);
                        });
                    });
                }
            }
        });

        Movie.findByIdAndDelete({
            _id: movieID
        },function (err,result){
            if (!err) res.json(result);
            else res.json(err);
        });
    },

    removeActor: function (req, res) {
        let actorID = req.params.actorid;
        let movieID = req.params.movieid;

         //Delete the movie
         Movie.findOne({ _id: movieID}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            
            if (movie.actors.length != 0){
                let status = false;
                for (let i = 0; i < movie.actors.length; i++){
                    if (actorID == movie.actors[i]){
                        movie.actors.splice(i,1);
                        status = true;
                        break;
                    }
                }
                if (status){
                    Actor.findOne({ _id: actorID }, function (err, actor) {
                        for (let i = 0; i < actor.movies.length; i++){
                            if (movieID == actor.movies[i]){
                                actor.movies.splice(i,1);
                                break;
                            }
                        }
                        Actor.updateOne({'_id': actorID}, { $set: { 'movies' : actor.movies } }, function (err,result){
                            if (err) res.json(err);
                        });
                    });
                    Movie.updateOne({'_id': movieID}, { $set: { 'actors' : movie.actors } }, function (err,result){
                        if (!err) res.json(movie);
                        else res.json(err);
                    });
                }
                else{
                    res.send("Cannot remove the actor with ID: " + actorID + " from the Movie: " + movie.title);
                }
            }
            else {
                res.send("Sorry, the Movie: " + movie.title + " currently has no actors");
            }
        });
    },

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                //NEW
                actor.movies.push(movie._id);
                actor.save(function(err){
                    if (err) return res.status(500).json(err);
                });

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(movie);
                });
            })
        });
    },

    getByYear: function(req, res) {
        let year1 = req.params.year1;
        let year2 = req.params.year2;

        if (year2>year1){
            res.status(400).send("Year1 should be greater than Year2");
        }
        else{
            Movie.where('year').gte(year2).lte(year1).exec(function (err, movie){
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json("Movie not found");

                res.json(movie)
            });
        }
    },

    deleteByYear: function(req, res) {
        let year1 = req.body.year1;
        let year2 = req.body.year2; //year1>year2 ->> year2 <= year <= year1

        let query = { $and : [{year:{ $gte: year2}}, {year:{ $lte: year1}}]};
        Movie.deleteMany(query,function (err,result){
            if (!err) res.json(result);
            else res.json(err);
        });

        // if (year2>year1){
        //     res.status(400).send("Year1 should be greater than Year2");
        // }
        // else{
        //     console.log("hello");
        //     Movie.where('year').gte(year2).lte(year1).exec(function (err, movie){
        //         if (err) return res.status(400).json(err);
        //         if (!movie) return res.status(404).json("Movie not found");
        //         for (let i = 0; i < movie.length; i++){
        //             Movie.deleteOne({'year':movie[i].year}, function (err,result){
        //                 if (err) res.json(err);
        //             });
        //         }
        //         res.json(movie)
        //     });
        // }
    },

    //Extra Task
    ActorMovieByYear: function(req, res) {
        let year = req.params.year;

        let actorslist = [];
        
        Movie.find({'year': year}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            console.log(movies);

            for (let i=0; i < movies.length; i++){
                //console.log(movies.length);
                if(movies[i].actors.length != 0){
                    //console.log(movies[i].actors.length);
                    for(let j = 0; j < movies[i].actors.length; j++){
                        //console.log(movies[i].actors[j].name);
                        actorslist.push(movies[i].actors[j].name);
                        //console.log(actorslist);
                    }
                }
            }
            console.log(actorslist);
            res.send(actorslist);
        });
    }
};