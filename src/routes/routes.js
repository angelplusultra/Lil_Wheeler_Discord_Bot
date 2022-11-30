import npmControllers from "../controllers/npmcontrollers.js"
import botControllers from "../controllers/botcontrollers.js";


export function NpmRoutes(interaction){

    if (interaction.options.getSubcommand() === 'searchregistry'){
        npmControllers.SearchRegistry(interaction);
         
    }

}
export async function MovieEmporiumRoutes(interaction){

    const commandName = interaction.options.getSubcommand();

      if (commandName === 'getmovie') {
          botControllers.getMovie(interaction);
      }
      if (commandName === 'addmovie'){
          botControllers.addMovie(interaction);
      }
      if (commandName === 'deletemovie'){
          botControllers.deleteMovie(interaction);
      }
      if (commandName === 'getfivemovies'){
          botControllers.getFive(interaction);
      }
      if (commandName === 'searchmovie'){
          botControllers.searchMovie(interaction);
      }
      if (commandName === 'updatemovietitle'){
          botControllers.updateTitle(interaction);
      }
      if (commandName === 'updatemovielink'){
          botControllers.updateLink(interaction);
      }
      if (commandName === 'reviewmovie') {
          botControllers.reviewMovie(interaction);
          
          
      }

}
