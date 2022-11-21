import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    title: {type: String, require: true},
    link: {type: String, sparse: true},
    ratings : [{userID: Number, watchedOn: Date, rating: String, review: String}],
    serverID: {type: Number, require: true}
  });

export default mongoose.model('Movie', movieSchema);