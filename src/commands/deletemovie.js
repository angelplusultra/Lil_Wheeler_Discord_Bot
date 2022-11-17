import { SlashCommandBuilder } from "discord.js";

const deleteMovieCommand = new SlashCommandBuilder()
.setName('deletemovie')
.setDescription('Query a movie from the DB to delete')
.addStringOption(option => option.setName('title').setDescription('Please enter the title of the movie').setRequired(true))



export default deleteMovieCommand.toJSON()
