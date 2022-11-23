import mongoose from 'mongoose'

 const schemas = {
  movieSchema: new mongoose.Schema({
    title: {type: String, required: true},
    link: {type: String, sparse: true},
    ratings : [{userID: Number, watchedOn: Date || null, rating: String, review: String}],
    serverID: {type: Number, required: true},
    releaseYear: {type: Number, required: true}
  }),
  userSchema: new mongoose.Schema({
    userID: {type: Number, required: true, unique: true}
  })
 } 




 const models = {
  Movie: mongoose.model('Movie', schemas.movieSchema),
  User: mongoose.model('User', schemas.userSchema)

 }

export default models




