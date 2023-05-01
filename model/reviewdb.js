const mongoose = require('mongoose');

const review = new mongoose.Schema({
    reviewGivenTo:{
        type:String
    },
    reviewGivenBy:{
        type:String,
    },
    reviewGiverName:{
        type:String,
    },
    reviewText:{
        type:String,
    }
});



const user_review = new mongoose.model('review', review);

module.exports= user_review;