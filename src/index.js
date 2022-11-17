// **IMPORTS**
import { Client, Routes } from "discord.js";
import * as path from "path";
import { config } from "dotenv";
import botControllers from "./controllers/botcontrollers.js";
import connectDB from "./config/db.js";
import { REST } from "@discordjs/rest";
import colors from "colors";

// COMMAND IMPORTS
import GetMovieCommand from "./commands/getmovie.js";
import { AddMovieCommand } from "./commands/addmovie.js";
import DeleteMovieCommand from "./commands/deletemovie.js";
import GetFiveMoviesCommand from './commands/getfivemovies.js'
import SearchMovieCommand from "./commands/searchmovie.js";
import UpdateLinkCommand from "./commands/updatelink.js";
import UpdateTitleCommand from "./commands/updatetitle.js";




// **CONSOLE.LOG SHORTHAND**
const log = console.log;

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
  log(`\n🤖 ${client.user.username} is logged in 🤖 `.trap.magenta);
});

// Slash Command Handlers
client.on("interactionCreate", (interaction) => {
  if (interaction.commandName === "addmovie") {
    botControllers.addMovie(interaction);
  }
  if (interaction.commandName === "deletemovie") {
    botControllers.deleteMovie(interaction);
  }

  if (interaction.commandName === "getmovie")
    botControllers.getMovie(interaction);

  if (interaction.commandName === "getfivemovies")
    botControllers.getFive(interaction);
    if(interaction.commandName === 'searchmovie'){
      botControllers.searchMovie(interaction)
    }
  if (interaction.commandName === "enroll") {
    const firstName = interaction.options.get("firstname").value;
    const lastName = interaction.options.get("lastname").value;

    interaction.reply({
      content: `hey there ${firstName} ${lastName}, you have enrolled in Banana Academy!`,
    });
    console.log(interaction.options.getString("food"));
  }
});

// Slash Commands Registration
async function main() {
  // **Commands Array**
  // const commands = [
  //   {
  //     name: "order",
  //     description: "Order something...",
  //     options: [
  //       {
  //         name: "food",
  //         description: "type of food",
  //         type: 3,
  //         required: true,
  //         choices: [
  //           { name: "Cake", value: "cake" },
  //           { name: "Hamburger", value: "hamburger" },
  //         ],
  //       },
  //       {
  //         name: "drink",
  //         description: "Choose a drink",
  //         type: 3,
  //         required: true,
  //         choices: [
  //           { name: "Dr. Pepper", value: "drpepper" },
  //           { name: "Sprite", value: "sprite" },
  //         ],
  //       },
  //     ],
  //   }
  // ];

  // **Slash Command Builder**

  const commands = [
    AddMovieCommand,
    DeleteMovieCommand,
    GetMovieCommand,
    GetFiveMoviesCommand,
    UpdateLinkCommand,
    UpdateTitleCommand,
    SearchMovieCommand
  ];

  // Updating the Guild Commands with My Bots Custom Commands
  try {
    // **TEST SERVER COMMAND REFRESH**
    log(`\n🛡 Refreshing Guild Application (/) Commands 🛡`.blue);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    // GLOBAL COMMAND REFRESH (ONLY UNCOMMENT WHEN ABOUT TO DEPLOY)
    log(`\n🔃 Refreshing Application (/) Commands 🔃`.blue);
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (error) {
    console.log(error);
  }
}

main();
