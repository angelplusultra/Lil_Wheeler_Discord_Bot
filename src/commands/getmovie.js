import { SlashCommandBuilder } from "discord.js";

const GetMovie = new SlashCommandBuilder()
.setName('getmovie')
.setDescription('Get a random movie recommendation from the DB')




export default GetMovie.toJSON()
