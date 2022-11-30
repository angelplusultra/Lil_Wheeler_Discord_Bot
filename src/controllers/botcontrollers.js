import { titleCase } from "title-case";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } from "discord.js";
import axios from "axios";
import validURL from "valid-url";
import embeds from "../embeds/embeds.js";
import models from "../models/models.js";

// Model Deconstruction
const {Movie, User} = models

// DEV NOTE: MAKE SURE TO IMPLEMENT THE LATEST MOVIE EMBED FOR ALL MOVIE RETRIEVAL CONTROLLERS


const botControllers = {
  addMovie: async function (interaction) {
    const title = titleCase(interaction.options.get("title").value);
    const link = interaction.options.get("link").value;
    const rating = interaction.options.getString("rate");
    const review = interaction.options.getString("review")
    const releaseYear = interaction.options.getInteger("year")
    const userID = +interaction.user.id
    const serverID = +interaction.guildId
    
try {
  const movies = await Movie.find({title, serverID, releaseYear})
  if(movies.length === 0){
    if (validURL.isUri(link)) {
      
        const newMovie = new Movie({ title, link, ratings:  !review && !rating ? [] : !rating ? [{userID, review}] : !review ? [{userID, rating}] : [{userID, rating, review}] , serverID, releaseYear  });
        console.log(newMovie)
        await newMovie.save();
        const res = await axios.get(
          `https://www.omdbapi.com/?t=${title.split(' ').join('_')}&y=${releaseYear}&apikey=272fc884`
        );
        const {
          Year: year,
          Director: director,
          Language: language,
          Runtime: runtime,
          Metascore: metascore,
          imdbRating,
        } = res.data;

  
        const movieEmbed = embeds.AddMovieEmbed(rating, interaction, title, res, year, director, language, runtime, link, review)
  
        interaction.reply({ content: `${title} has been saved to the DB!`, embeds: [movieEmbed] });

    } else{

      const embed = new EmbedBuilder()
      .setTitle('Error: Invalid URL')
      .setDescription('Sorry, the URL entered is invalid')
      
      interaction.reply({embeds: [embed] })
    }
  } else{
    
    interaction.reply({ content: `${title} already exists in the DB!` })
  }
} catch (error) {
  console.log(error)
  interaction.reply(`Sorry, something went wrong with this request`)
  
}
     
    
    
  },
  deleteMovie: async function (interaction) {
    const title = titleCase(interaction.options.get("title").value);
    const serverID = interaction.guildId
    try {
      const result = await Movie.findOneAndDelete({ title: title, serverID: serverID, releaseYear  });
      interaction.reply({
        content: `${title} ${
          !result ? "was not found in" : "was deleted from"
        } the DB`,
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: `Sorry, something went wrong with this process`,
      });
    }
  },
  getMovie: async function (interaction) {
    const userID = +interaction.user.id
    const serverID = +interaction.guildId
    try {
      const movies = await Movie.find({serverID: serverID});
      const randomSelection = movies[Math.floor(Math.random() * movies.length)];
      const {title, link } = randomSelection
      const userRatings = randomSelection.ratings.filter(el => el.userID === userID)
      const userLatestReview = userRatings[userRatings.length - 1]
      console.log(randomSelection, userRatings);
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${title
          .split(" ")
          .join("_")}&apikey=272fc884`
      );
      
      const {
        Year: year,
        Director: director,
        Language: language,
        Runtime: runtime,
        Metascore: metascore,
        imdbRating,
        Plot: plot,
        Poster: poster
      } = res.data;


     const movieEmbed = embeds.StandardMovieEmbed(title, userLatestReview, interaction, plot, poster, year, director, language, runtime, link)

      interaction.reply({ embeds: [movieEmbed] });
    } catch (error) {
      console.log(error);
      interaction.reply("Sorry, something went wrong with this process");
    }
  },
  getFive: async function (interaction) {
    const serverID = interaction.guildId
    const userID = interaction.user.id
    try {
      const movies = await Movie.find({serverID});
      let movieArray = [];

      
      

      Array(5)
        .fill()
        .forEach(async (loop) => {
          const randomSelection = movies[Math.floor(Math.random() * movies.length)];
          const { title, link } = randomSelection
          const userRatings = randomSelection.ratings.filter(el => el.userID === userID)
          const userLatestReview = userRatings[userRatings.length - 1]
          
          const res = await axios.get(`https://www.omdbapi.com/?t=${title.split(" ").join("_")}&y=${randomSelection.releaseYear}&apikey=272fc884`);
          const {
            Year: year,
            Director: director,
            Language: language,
            Runtime: runtime,
            Metascore: metascore,
            imdbRating,
            Poster: poster,
            Plot: plot
          } = res.data;

          const movieEmbed = embeds.StandardMovieEmbed(title, userLatestReview, interaction, plot, poster, year, director, language, runtime, link)
          movieArray.push(movieEmbed);

          // interaction.channel.send({ embeds: [movieEmbed] });

          if (movieArray.length === 5) {
           await interaction.reply({ embeds: movieArray });
            console.log(movieArray.length)
          } else {
            return;
          }
        });
    } catch (error) {
      console.log(error);
      interaction.reply("Sorry, something went wrong with this process");
    }
  },
  searchMovie: async function (interaction) {
    const movieQuery = titleCase(interaction.options.getString("title"));
    const userID = +interaction.user.id
    const serverID = +interaction.guildId
    const regex = new RegExp(movieQuery, "i");
    const embedsArray = []

    try {
       
      const possibleMatches = await Movie.find({ title: { $regex: regex }, serverID });

      if(possibleMatches.length === 0){
      interaction.reply(`Could not find __**${movieQuery}**__ in the list`);

      }
      
      // console.log(possibleMatches[0].ratings.filter(el => el.userID === userID).length);
      possibleMatches.forEach(async (movie) => {

        const userRatings = movie.ratings.filter(el => el.userID === userID)
        const userLatestReview = userRatings[userRatings.length - 1]
        const res = await axios.get(
          `https://www.omdbapi.com/?t=${movie.title}&y=${movie.releaseYear}&apikey=272fc884`
        );
        const {
          Year: year,
          Director: director,
          Language: language,
          Runtime: runtime,
          Metascore: metascore,
          imdbRating,
        } = res.data;  

        
        const movieEmbed = embeds.SearchMovieEmbed(movie, userRatings, userLatestReview, interaction, res, year, director, language, runtime)
    

        embedsArray.push(movieEmbed)
        console.log("loop")
        if (embedsArray.length !== possibleMatches.length){
          return;
        } else{
          interaction.reply({embeds: embedsArray})
        }

      })
  
      
    } catch (error) {
      console.log(error);
      
    }
  },
  updateTitle: async function (interaction) {
    const movieQuery = titleCase(interaction.options.getString("title"));
    const serverID = +interaction.guildId
    const titleUpdate = titleCase(interaction.options.getString("newtitle"));
    try {
      const movie = await Movie.findOneAndUpdate(
        { title: movieQuery, serverID: serverID },
        { title: titleUpdate }
      );

      if (!movie) {
        interaction.reply(
          `Sorry, __**${movieQuery}**__ was not found in the DB`
        );
      } else {
        interaction.reply(
          `The title for __**${movieQuery}**__ has been updated to __**${titleUpdate}**__`
        );
      }
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "Sorry, something went wrong with this process.",
      });
    }
  },
  updateLink: async function (interaction) {
    const movieQuery = titleCase(interaction.options.getString("title"));
    const newLink = interaction.options.getString("newlink");
    const serverID = +interaction.guildId;
    if (validURL.isUri(newLink)) {
      try {
        const movies = await Movie.findOneAndUpdate(
          { title: movieQuery, serverID: serverID },
          { link: newLink }
        );
        if (!movies) {
          interaction.reply(`Sorry, ${movieQuery} was not found in the DB`);
        } else {
          interaction.reply(
            `The link for __**${movieQuery}**__ has been updated`
          );
        }
      } catch (error) {
        console.log(error);
        interaction.reply("Sorry, something went wrong with this process");
      }
    } else {
      interaction.reply(`${newLink} is not a valid URL`);
    }
  },

  reviewMovie: async function(interaction) {
    const movieQuery = titleCase(interaction.options.getString("title"));
    const userID = +interaction.user.id
    const userRating = titleCase(interaction.options.getString("rating"));
    const userReview = interaction.options.getString("review");
    const serverID = +interaction.guildId
    try {
      const movie = await Movie.findOne({title: movieQuery, serverID})

      if(!movie){
        interaction.reply(`Sorry ${movieQuery} does not exist in the DB`)  

      } else{

      movie.ratings.push({userID: userID, rating: userRating, review: userReview});

      console.log(movie)

      await movie.save();

      const res = await axios.get(
        `https://www.omdbapi.com/?t=${movieQuery.split(' ').join('_')}&apikey=272fc884`
      );
      const {
        Year: year,
        Director: director,
        Language: language,
        Runtime: runtime,
        Metascore: metascore,
        imdbRating,
        Plot: plot,
        Poster: poster
      } = res.data;
      console.log(res.data);

      const userLatestReview = movie.ratings[movie.ratings.length - 1]
      const movieEmbed = embeds.StandardMovieEmbed(movie.title, userLatestReview, interaction, plot, poster, year, director, language, runtime, movie.link)

      interaction.reply({ embeds: [movieEmbed] });

      }
      
      
    } catch (error) {
      console.log(error);
      interaction.reply(`Sorry, something went wrong with this process`)
      
    }
  }
};

export default botControllers;
