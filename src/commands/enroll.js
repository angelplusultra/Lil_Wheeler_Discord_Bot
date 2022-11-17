import { SlashCommandBuilder } from "discord.js";

const enrollCommand = new SlashCommandBuilder()
.setName('enroll')
.setDescription('Enroll into the Banana Academy!')
.addStringOption(option => option.setName('firstname').setDescription('Please enter your first name').setRequired(true))
.addStringOption(option => option.setName('lastname').setDescription('Please enter your last name').setRequired(true))


export default enrollCommand.toJSON()
