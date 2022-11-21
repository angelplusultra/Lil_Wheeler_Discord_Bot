import { EmbedBuilder } from "@discordjs/builders";

const embeds = {
    AddMovieEmbed: function(rating, interaction, title, res, year, director, language, runtime, link){
   return new EmbedBuilder()
    .setThumbnail(
      !rating ? null : rating.length >= 4 ? "https://i.imgur.com/pIfdoIW.gif" : null
    )
    .setColor(!rating ? 0x20124d : rating.length >= 4 ? 0xd4af37 : 0x20124d)
    .setTitle(
      !rating ? title : rating.length >= 4 ? `🥇${title}🥇` : title
    )
    .setDescription(res.data.Plot || "N/A")
    .setImage(res.data.Poster || null)
    .addFields(
      { name: "Year", value: year || "N/A", inline: true },
      { name: "Director", value: director || "N/A", inline: true },
      { name: "Language", value: language || "N/A", inline: true },
      { name: "Runtime", value: runtime || "N/A", inline: true },
      {name: `${interaction.user.username}'s Rating`, value: rating ? rating : "N/A", inline: true},
      // {name: `${interaction.user.username}'s Review`, value: userReview || "N/A", inline: true}
    )
    .setURL(link || null)

}

    }
    
    
    

export default embeds