import npmControllers from "../controllers/npmcontrollers.js";
import botControllers from "../controllers/moviecontrollers.js";

function NpmRoutes(interaction) {
  ;

  switch (interaction.options.getSubcommand()) {
    case "searchregistry":
      npmControllers.SearchRegistry(interaction);
      break;
    case "findpackage":
      npmControllers.FindPackage(interaction);
      break;
  }
}

function MovieEmporiumRoutes(interaction) {
   ;

  switch (interaction.options.getSubcommand()) {
    case "getmovie":
        botControllers.getMovie(interaction);
        break;
    case "addmovie":
        botControllers.addMovie(interaction);
        break;
    case "deletemovie":
        botControllers.deleteMovie(interaction);
        break;
    case "getfivemovies":
        botControllers.getFive(interaction);
        break;
    case "searchmovie":
        botControllers.searchMovie(interaction);
        break;
    case "updatemovietitle":
        botControllers.updateTitle(interaction);
        break;
    case "updatemovielink":
        botControllers.updateLink(interaction);
        break;
    case "reviewmovie":
        botControllers.reviewMovie(interaction);
        break;

    
  }
}

export { NpmRoutes, MovieEmporiumRoutes }