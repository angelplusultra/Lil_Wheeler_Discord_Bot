import { titleCase } from "title-case";
import Movie from "../models/Movie.js";
import { EmbedBuilder } from "discord.js";
import axios from "axios";
import validURL from "valid-url";
import moment from 'moment-timezone'
import embeds from "../embeds/embeds.js";



// DEV NOTE: MAKE SURE TO IMPLEMENT THE LATEST MOVIE EMBED FOR ALL MOVIE RETRIEVAL CONTROLLERS

const botControllers = {
  addMovie: async function (interaction) {
    const title = titleCase(interaction.options.get("title").value);
    const link = interaction.options.get("link").value;
    const rating = interaction.options.getString("rate");
    const review = interaction.options.getString("review")
    const userID = +interaction.user.id
    const serverID = +interaction.guildId
    
try {
  const movie = await Movie.findOne({title, serverID})
  if(!movie){
    if (validURL.isUri(link)) {
      
        const newMovie = new Movie({ title, link, ratings:  !review && !rating ? [] : !rating ? [{userID, review}] : !review ? [{userID, rating}] : [{userID, rating, review}] , serverID });
        console.log(newMovie)
        await newMovie.save();
        const res = await axios.get(
          `https://www.omdbapi.com/?t=${title.split(' ').join('_')}&apikey=272fc884`
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
      interaction.reply(`Sorry, the link you entered is not a valid URL`)
    }
  } else{
    interaction.reply(`${title} already exists in the DB!`)
  }
} catch (error) {
  console.log(error)
  interaction.reply(`Sorry, something went wrong with this request`)
  
}
     
    
    
  },
  deleteMovie: async function (interaction) {
    const title = titleCase(interaction.options.get("title").value);
    try {
      const result = await Movie.findOneAndDelete({ title: title });
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
    try {
      const movies = await Movie.find();
      const { title, link } = movies[Math.floor(Math.random() * movies.length)];
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${title
          .split(" ")
          .join("_")}&apikey=272fc884`
      );
      console.log(res.data);
      const movieEmbed = new EmbedBuilder()
        .setColor(0x20124d)
        .setTitle(title || "N/A")
        .setDescription(res.data.Plot || "N/A")
        .setImage(res.data.Poster || null)
        .addFields(
          { name: "Year", value: res.data.Year || "N/A", inline: true },
          { name: "Director", value: res.data.Director || "N/A", inline: true },
          { name: "Language", value: res.data.Language || "N/A", inline: true },
          { name: "Runtime", value: res.data.Runtime || "N/A", inline: true }
        )
        .setURL(link || null);

      interaction.reply({ embeds: [movieEmbed] });
    } catch (error) {
      console.log(error);
      interaction.reply("Sorry, something went wrong with this process");
    }
  },
  getFive: async function (interaction) {
    try {
      const movies = await Movie.find();
      let movieArray = [];

      Array(5)
        .fill()
        .forEach(async (loop) => {
          const { title, link } =
            movies[Math.floor(Math.random() * movies.length)];
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
          } = res.data;
          const movieEmbed = new EmbedBuilder()
            .setThumbnail(
              imdbRating >= 8 ? "https://i.imgur.com/pIfdoIW.gif" : null
            )
            .setColor(imdbRating >= 8 ? 0xd4af37 : 0x20124d)
            .setTitle(imdbRating >= 8 ? `🥇${title}🥇` : title || "N/A")
            .setDescription(res.data.Plot || "N/A")
            .setImage(res.data.Poster || null)
            .addFields(
              { name: "Year", value: year || "N/A", inline: true },
              { name: "Director", value: director || "N/A", inline: true },
              { name: "Language", value: language || "N/A", inline: true },
              { name: "Runtime", value: runtime || "N/A", inline: true },
              {
                name: "Metascore",
                value: metascore >= 8 ? `${metascore}` : metascore || "N/A",
                inline: true,
              },
              {
                name: "IMDB Rating",
                value: imdbRating >= 8 ? `${imdbRating}` : imdbRating || "N/A",
                inline: true,
              }
            )
            .setURL(link || null);
          movieArray.push(movieEmbed);

          // interaction.channel.send({ embeds: [movieEmbed] });

          if (movieArray.length < 5) {
            return;
          } else {
            interaction.reply({ embeds: movieArray });
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
        console.log(typeof userLatestReview?.watchedOn === "undefined")
        const res = await axios.get(
          `https://www.omdbapi.com/?t=${movie.title}&apikey=272fc884`
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
    const titleUpdate = titleCase(interaction.options.getString("newtitle"));
    try {
      const movie = await Movie.findOneAndUpdate(
        { title: movieQuery },
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
    if (validURL.isUri(newLink)) {
      try {
        const movies = await Movie.findOneAndUpdate(
          { title: movieQuery },
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

      movie.ratings.push({userID: userID, rating: userRating, review: userReview, watchedOn: new Date()});

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
      } = res.data;
      console.log(res.data);

      const movieEmbed = new EmbedBuilder()
        .setThumbnail(
          imdbRating >= 8 ? "https://i.imgur.com/pIfdoIW.gif" : null
        )
        .setColor(userRating.length >= 4 ? 0xd4af37 : 0x20124d)
        .setTitle(
          imdbRating >= 8 ? `🥇${movieQuery}🥇` : movieQuery || "N/A"
        )
        .setDescription(res.data.Plot || "N/A")
        .setImage(res.data.Poster || null)
        .addFields(
          { name: "Year", value: year || "N/A", inline: true },
          { name: "Director", value: director || "N/A", inline: true },
          { name: "Language", value: language || "N/A", inline: true },
          { name: "Runtime", value: runtime || "N/A", inline: true },
          {name: 'Watched on', value: moment.tz(movie.watchedOn, 'America/Los_Angeles').format('MMMM Do YYYY'), inline: true},
          {name: `${interaction.user.username}'s Rating`, value: userRating, inline: true},
          {name: `${interaction.user.username}'s Review`, value: userReview || "N/A", inline: true}
        )
        .setURL(movie.link || null);

      interaction.reply({ embeds: [movieEmbed] });

      }

      

   

      
      
    } catch (error) {
      console.log(error);
      interaction.reply(`Sorry, something went wrong with this process`)
      
    }
  }
};

export default botControllers;
