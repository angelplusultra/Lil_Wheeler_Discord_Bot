import { SlashCommandBuilder } from "discord.js";
import moment from 'moment-timezone'

const currentYear = +moment().format('YYYY');  


const botCommands = {
    LilWheelersMovieEmporium: new SlashCommandBuilder()
    .setName("movieemporium")
    .setDescription('A database to add/retrieve movies with their associated download/stream links')
        // **ADD MOVIE**
    .addSubcommand(subcommand => subcommand.setName('addmovie').setDescription('Add a movie to the database')
    .addStringOption(option => option
    .setName('title')
    .setDescription('Pleas enter the title of the movie')
    .setRequired(true))
    .addIntegerOption(option => option.setName('year').setDescription('Please enter the release year of the movie').setRequired(true).setMinValue(1888).setMaxValue(currentYear))
    .addStringOption(option => option.setName('link').setDescription('Please enter the link to the movie').setRequired(true))
    .addStringOption(option => option.setName('rate').setDescription('rate the movie out of 5 stars').addChoices({name: '⭐', value: '⭐' }, {name: '⭐⭐', value: '⭐⭐' }, {name: '⭐⭐⭐', value: '⭐⭐⭐' },{name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' }, {name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' } )).addStringOption(option => 
        option.setName('review').setDescription('Please enter a review for the movie')))
        //**DELETE MOVIE**
    .addSubcommand(subcommand => subcommand.setName('deletemovie').setDescription('delete a movie from the database')
    .addStringOption(option => option
    .setName('title')
    .setDescription('Pleas enter the title of the movie')
    .setRequired(true) )
    .addIntegerOption(option => option.setName('year').setDescription('Please enter the release year of the movie').setRequired(true).setMinValue(1888).setMaxValue(currentYear)))
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
    .addIntegerOption(option => option.setName('year').setDescription('Please enter the release year of the movie').setRequired(true).setMinValue(1888).setMaxValue(currentYear))
    .addStringOption(option => option.setName('newlink').setRequired(true).setDescription('Plase enter the new link')))
     // **UPDATE MOVIE LINK**   
    .addSubcommand(subcommand => subcommand.setName('updatemovietitle')
    .setDescription('Update the title of a movie in the DB')
    .addStringOption(option => option.setName('title').setRequired(true).setDescription('Please enter the current title of the movie you want to change'))
    .addIntegerOption(option => option.setName('year').setDescription('Please enter the release year of the movie').setRequired(true).setMinValue(1888).setMaxValue(currentYear))
    .addStringOption(option => option.setName('newtitle').setRequired(true).setDescription('Plase enter the new title')))


    .addSubcommand(subcommand => subcommand.setName('reviewmovie').setDescription('Rate/Review a movie')
    .addStringOption(option => option.setName('title').setDescription('Which movie in the DB would you like to review?').setRequired(true))
    .addIntegerOption(option => option.setName('year').setDescription('Please enter the release year of the movie').setRequired(true).setMinValue(1888).setMaxValue(currentYear))
    .addStringOption(option => option.setName('rating').setDescription('Choose a rating')
    .addChoices({name: '⭐', value: '⭐' }, {name: '⭐⭐', value: '⭐⭐' }, {name: '⭐⭐⭐', value: '⭐⭐⭐' },{name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' }, {name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' } ).setRequired(true))
    .addStringOption(option => option.setName('review').setDescription('Write a review for the film').setMaxLength(1024))),

    NpmBot: new SlashCommandBuilder()
    .setName('npmbot')
    .setDescription('Quickly get info about packages in the NPM registry')
    .addSubcommand(subcommand => subcommand.setName('searchregistry').setDescription('search registry with a keyword')
    .addStringOption(option => option.setName('keyword').setDescription('use a keyword to search the registry').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('findpackage').setDescription('Get the metadata for 1 package')
    .addStringOption(option => option.setName('name').setDescription('Please enter the exact name of the package').setRequired(true)))



}

export default botCommands