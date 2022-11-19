import { SlashCommandBuilder } from "discord.js";

const botCommands = {
    LilWheelersMovieEmporium: new SlashCommandBuilder()
    .setName("movieemporium")
    .setDescription('A database to add/retrieve movies with their associated download/stream links')
        // **ADD MOVIE**
    .addSubcommand(subcommand => subcommand.setName('addmovie').setDescription('Add a movie to the database')
    .addStringOption(option => option
    .setName('title')
    .setDescription('Pleas enter the title of the movie')
    .setRequired(true)
    ).addStringOption(option => option.setName('link').setDescription('Please enter the link to the movie').setRequired(true)))
        //**DELETE MOVIE**
    .addSubcommand(subcommand => subcommand.setName('deletemovie').setDescription('delete a movie from the database')
    .addStringOption(option => option
    .setName('title')
    .setDescription('Pleas enter the title of the movie')
    .setRequired(true)
    ))
    // **GET MOVIE**
    .addSubcommand(subcommand => subcommand.setName('getmovie').setDescription('Get a random movie recommendation from the DB'))
    // **GET FIVE MOVIES**
    .addSubcommand(subcommand => subcommand.setName('getfivemovies')
    .setDescription('Get 5 random movie recommendations from the DB'))
    // **SEARCH MOVIE**
    .addSubcommand(subcommand => subcommand.setName('searchmovie')
    .setDescription('Search for a movie in the DB')
    .addStringOption((option) => option.setName('title').setRequired(true).setDescription('Please enter the title of the movie')))
    // **UPDATE MOVIE TITLE**
    .addSubcommand(subcommand => subcommand.setName('updatemovielink')
    .setDescription('Update the download/stream link of a movie in the DB')
    .addStringOption(option => option.setName('title').setRequired(true).setDescription('Please enter title of the movie you wish to modify'))
    .addStringOption(option => option.setName('newlink').setRequired(true).setDescription('Plase enter the new link')))
     // **UPDATE MOVIE LINK**   
    .addSubcommand(subcommand => subcommand.setName('updatemovietitle')
    .setDescription('Update the title of a movie in the DB')
    .addStringOption(option => option.setName('title').setRequired(true).setDescription('Please enter the current title of the movie you want to change'))
    .addStringOption(option => option.setName('newtitle').setRequired(true).setDescription('Plase enter the new title')))


}

export default botCommands