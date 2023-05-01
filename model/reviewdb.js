const mongoose = require('mongoose');

const review = new mongoose.Schema({
    reviewGivenTo:{ // document id
        type:String
    },
    reviewGivenBy:{ // document id
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