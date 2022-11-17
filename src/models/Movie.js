import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    title: {type: String, unique: true, require: true},
    link: {type: String, unique: true, sparse: true}
  });

export default mongoose.model('Movie', movieSchema);