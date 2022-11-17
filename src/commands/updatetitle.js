import { SlashCommandBuilder } from "@discordjs/builders";
const UpdateTitleCommand = new SlashCommandBuilder()
    .setName('updatemovietitle')
    .setDescription('Update the title of a movie in the DB')
    .addStringOption(option => option.setName('title').setRequired(true).setDescription('Please enter the current title of the movie you want to change'))
    .addStringOption(option => option.setName('newtitle').setRequired(true).setDescription('Plase enter the new title'));

    export default UpdateTitleCommand.toJSON()