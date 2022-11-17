import { SlashCommandBuilder } from "@discordjs/builders";
const UpdateLinkCommand = new SlashCommandBuilder()
.setName('updatemovielink')
.setDescription('Update the download/stream link of a movie in the DB')
.addStringOption(option => option.setName('title').setRequired(true).setDescription('Please enter title of the movie you wish to modify'))
.addStringOption(option => option.setName('newlink').setRequired(true).setDescription('Plase enter the new link'));

export default UpdateLinkCommand.toJSON()