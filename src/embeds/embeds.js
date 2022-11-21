import { EmbedBuilder } from "@discordjs/builders";
import moment from 'moment-timezone'

const embeds = {
    AddMovieEmbed: function(rating, interaction, title, res, year, director, language, runtime, link, review){
   return new EmbedBuilder()
    .setThumbnail(
      !rating ? null : rating.length >= 4 ? "https://i.imgur.com/pIfdoIW.gif" : null
    )
    .setColor(!rating ? 0x20124d : rating.length >= 4 ? 0xd4af37 : 0x20124d)
    .setTitle(title
    )
    .setDescription(res.data.Plot || "N/A")
    .setImage(res.data.Poster || null)
    .addFields(
      { name: "Year", value: year || "N/A", inline: true },
      { name: "Director", value: director || "N/A", inline: true },
      { name: "Language", value: language || "N/A", inline: true },
      { name: "Runtime", value: runtime || "N/A", inline: true },
      {name: `${interaction.user.username}'s Rating`, value: rating || "N/A", inline: true},
      {name: `${interaction.user.username}'s Review`, value: review || "N/A", inline: true}
    )
    .setURL(link || null)

},
    SearchMovieEmbed: function(movie, userRatings, userLatestReview, interaction,  res, year, director, language, runtime){
      return new EmbedBuilder()
      .setThumbnail( userRatings.length === 0 ? null : userLatestReview.rating.length >= 4 ? "https://i.imgur.com/pIfdoIW.gif" : null
        
      )
      .setColor(userRatings.length === 0 ? 0x20124d : userLatestReview.rating.length >= 4 ? 0xd4af37 : 0x20124d)
      .setTitle( movie.title
      )
      .setDescription(res.data.Plot || "N/A")
      .setImage(res.data.Poster || null)
      .addFields(
        { name: "Year", value: year || "N/A", inline: true },
        { name: "Director", value: director || "N/A", inline: true },
        { name: "Language", value: language || "N/A", inline: true },
        { name: "Runtime", value: runtime || "N/A", inline: true },
        // {name: "Watched on:", value: typeof userLatestReview?.watchedOn === 'undefined' ? "N/A" : moment.tz(userLatestReview.watchedOn, 'America/Los_Angeles').format('MMMM Do YYYY') , inline: true},
        {name: `${interaction.user.username}'s Rating`, value: userRatings.length > 0 ? userLatestReview.rating : "N/A", inline: true},
        {name: `${interaction.user.username}'s Review`, value: typeof userLatestReview?.review === 'undefined' ? "N/A" : userLatestReview.review, inline: true}
      
      
      )
      .setURL(movie.link || null)
  

}

    }
    
    
    

export default embeds