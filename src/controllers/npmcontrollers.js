import axios from "axios"
import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders"
import { ActionRowBuilder, ButtonStyle, ComponentType } from "discord.js"






const npmControllers = {
    SearchRegistry: async function(interaction){
        const keyword = interaction.options.getString("keyword")
         try {
          const res = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${keyword}`)
          const packageArray = res.data.objects
          
          let embedsArray = []
          let componentsArray = []
          for(let i = 0; i < 5; i++){
            console.log(packageArray[0].score)
            const  {name, description, links} = packageArray[i].package
           const button = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(name).setStyle(ButtonStyle.Primary).setLabel(`Visit ${name} on NPM`))  
           const embed = new EmbedBuilder().setTitle(name || "N/A").setDescription(description || "N/A").setURL(links.npm || null)
        //    .setFields({name: "Downloads", value: })
           embedsArray.push(embed)
           componentsArray.push(button)

            if(i == 4){
               await interaction.reply({embeds: embedsArray, components: componentsArray})
            //   setTimeout(_ => interaction.deleteReply(), 5000)

            } 
            
          }
          const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 2000 });
            collector.on('collect',async i => {
                await i.update({ embeds: [], content: `You clicked ${i.customId}`, components: [] });
            })

            collector.on('end', collected => { 
                console.log(collected);

                
            });
        } catch (error) {
            console.log(error)
            
        }


    },
    FindPackage: async function(interaction){
        const keyword = interaction.options.getString("name")

        try {
            const dowloads = await axios.get(`https://api.npmjs.org/downloads/point/last-year/${keyword}`)
            const metadata = await axios.get(`https://registry.npmjs.org/${keyword}`)

            console.log(dowloads)

            
        } catch (error) {
            
        }
    }
}


export default npmControllers