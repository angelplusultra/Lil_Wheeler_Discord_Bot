import { SlashCommandBuilder } from "@discordjs/builders";
const SearchMovieCommand = new SlashCommandBuilder()
    .setName('searchmovie')
    .setDescription('Search for a movie in the DB')
    .addStringOption((option) => option.setName('title').setRequired(true).setDescription('Please enter the title of the movie'))

    export default SearchMovieCommand.toJSON()
    