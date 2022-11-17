import { SlashCommandBuilder } from "@discordjs/builders";

const GetFiveMoviesCommand = new SlashCommandBuilder()
    .setName('getfivemovies')
    .setDescription('Get 5 random movie recommendations from the DB')

export default GetFiveMoviesCommand.toJSON()