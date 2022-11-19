import { titleCase } from "title-case";
import Movie from "../models/Movie.js";
import { EmbedBuilder } from "discord.js";
import axios from "axios";
import validURL from "valid-url";

const botControllers = {
  addMovie: async function (interaction) {
    const title = titleCase(interaction.options.get("title").value);
    const link = interaction.options.get("link").value;
    
    if (validURL.isUri(link)) {
      const newMovie = new Movie({ title: title, link: link });
      console.log(newMovie);
      try {
        await newMovie.save();
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
            {
              name: "Director",
              value: res.data.Director || "N/A",
              inline: true,
            },
            {
              name: "Language",
              value: res.data.Language || "N/A",
              inline: true,
            },
            { name: "Runtime", value: res.data.Runtime || "N/A", inline: true }
          )
          .setURL(link || null);

        interaction.reply({
          content: `__**${title}**__ has been added to the list!\n`,
          embeds: [movieEmbed],
        });
      } catch (error) {
        console.log(error);
        interaction.reply({ content: `${title} is already on the list` });
      }
    } else {
      interaction.reply({ content: `${link} is not a valid URL` });
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

    try {
      const regex = new RegExp(movieQuery, "i");
      const movie = await Movie.find({ title: { $regex: regex } });
      console.log(movie);
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${movie[0].title}&apikey=272fc884`
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
        .setColor(imdbRating >= 8 ? 0xd4af37 : 0x20124d)
        .setTitle(
          imdbRating >= 8 ? `🥇${movie[0].title}🥇` : movie[0].title || "N/A"
        )
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
        .setURL(movie[0].link || null);

      interaction.reply({ embeds: [movieEmbed] });
    } catch (error) {
      console.log(error);
      interaction.reply(`Could not find __**${movieQuery}**__ in the list`);
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
};

export default botControllers;
