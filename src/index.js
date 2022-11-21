// **IMPORTS**
import {
  Client,
  Routes,
} from "discord.js";
import * as path from "path";
import { config } from "dotenv";
import botControllers from "./controllers/botcontrollers.js";
import connectDB from "./config/db.js";
import { REST } from "@discordjs/rest";
import colors from "colors";
// COMMAND IMPORTS
import SlashCommands from "./commands/slashcommands.js";

// **CONSOLE.LOG SHORTHAND**
const log = console.log;
log(
  `\n Application is in ${
    process.env.NODE_ENV === "development"
      ? "development".red
      : "production".green
  } mode`
);
// **ENV CONFIG**
config({ path: path.join(path.resolve() + "/src/config/.env") });

connectDB();

// **TOKENS**
const TOKEN = process.env.BOT_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// **CLIENT INSTANTIATION**
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// **DISCORD API CONNECTION**
const rest = new REST({ version: 10 }).setToken(TOKEN);

// Bot on Succesful Connection
client.on("ready", () => {
  log(`\n🤖 ${client.user.username} is logged in`.trap.magenta);
  
});

// Slash Command Handlers
client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {

    
      // **MOVIE EMPORIUM ROUTES**
    if (interaction.commandName === 'movieemporium') {
      if (interaction.options.getSubcommand() === 'getmovie') {
          botControllers.getMovie(interaction);
      }
      if (interaction.options.getSubcommand() === 'addmovie'){
          botControllers.addMovie(interaction);
      }
      if (interaction.options.getSubcommand() === 'deletemovie'){
        botControllers.deleteMovie(interaction);
      }
      if (interaction.options.getSubcommand() === 'getfivemovies'){
        botControllers.getFive(interaction);
      }
      if (interaction.options.getSubcommand() === 'searchmovie'){
          botControllers.searchMovie(interaction);
      }
      if (interaction.options.getSubcommand() === 'updatemovietitle'){
          botControllers.updateTitle(interaction);
      }
      if (interaction.options.getSubcommand() === 'updatemovielink'){
          botControllers.updateLink(interaction);
      }
      if (interaction.options.getSubcommand() === 'reviewmovie') {
          botControllers.reviewMovie(interaction);
          
          
      }
  }
    
  } else if (interaction.isSelectMenu()){
      if (interaction.customId === 'food_options'){

      }
    
    interaction.reply({content: "it works"})
  }
});

// **SLASH COMMANDS REGISTRATION**
async function main() {
  // **POPULATING AN ARRAY OF SLASH COMMANDS CONVERTED INTO JSON OBJECTS**
  const commands = [
    SlashCommands.LilWheelersMovieEmporium.toJSON()
  ];

  try {
    // **TEST SERVER COMMAND REFRESH**

    if (process.env.NODE_ENV === "development") {
      // Updating the Guild Commands with My Bots Custom Commands
      log(
        `\n🧪 Refreshing ${colors.bold.underline(
          "Test"
        )} Application (/) Commands`.blue
      );
       await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
    } else {
      // GLOBAL COMMAND REFRESH (ONLY UNCOMMENT WHEN ABOUT TO DEPLOY)
      log(`\n🔃 Refreshing Application (/) Commands`.blue);
      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
    }

    client.login(TOKEN);
  } catch (error) {
    console.log(error);
  }
}

main();



