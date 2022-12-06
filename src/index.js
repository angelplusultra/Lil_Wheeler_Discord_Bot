// **IMPORTS**
import { Client, Routes } from "discord.js";
import * as path from "path";
import { config } from "dotenv";
import botControllers from "./controllers/moviecontrollers.js";
import connectDB from "./config/db.js";
import { REST } from "@discordjs/rest";
import colors from "colors";
import bcrypt from "bcrypt";
// COMMAND IMPORTS
import SlashCommands from "./commands/slashcommands.js";
import {
  NpmRoutes,
  MovieEmporiumRoutes,
  OpenAIRoutes,
  ImageBotRoutes
} from "./routes/routes.js";

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

// Mongo Connection
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
    const route = interaction.commandName;

    switch (route) {
      case "movieemporium":
        MovieEmporiumRoutes(interaction);
        break;
      case "npmbot":
        NpmRoutes(interaction);
        break;
      case "openai":
        OpenAIRoutes(interaction);
        break;
      case "imagebot":
        ImageBotRoutes(interaction)
        break;
    }
  }
});

// **SLASH COMMANDS REGISTRATION**
async function main() {
  // **POPULATING AN ARRAY OF SLASH COMMANDS CONVERTED INTO JSON OBJECTS**
  const commands = [
    SlashCommands.LilWheelersMovieEmporium.toJSON(),
    SlashCommands.NpmBot.toJSON(),
    SlashCommands.OpenAI.toJSON(),
    SlashCommands.ImageBot.toJSON()
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
