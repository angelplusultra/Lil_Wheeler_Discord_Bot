import axios from "axios"
import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders"
import { ActionRowBuilder, ButtonStyle, ComponentType, AttachmentBuilder } from "discord.js"
import {svg2png } from 'svg-png-converter'
import extract from 'extract-svg-viewbox'





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
            // const dowloads = await axios.get(`https://api.npmjs.org/downloads/point/last-year/${keyword}`)
            const metadata = await axios.get(`https://registry.npmjs.org/${keyword}`)
            const svg = await axios.get(`https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/${keyword}.svg`)

            console.log(svg.data)

            const viewBox = extract(svg.data)
                console.log(viewBox)

               const newSVG = svg.data.replace(viewBox, '0 0 100 100')

                console.log(newSVG)


            const outputBuffer = await svg2png({input: svg.data, encoding: 'buffer', format: 'png', quality: 1 })
            const file = new AttachmentBuilder(outputBuffer)
            .setName(`${keyword}.png`)


            const {name, description, readme} = metadata.data
            console.log(file)
            const embed = new EmbedBuilder().setTitle(name).setDescription(description).setThumbnail(`attachment://${keyword}.png` || null)
            await interaction.reply({embeds: [embed], files: [file] });

                


            
        } catch (error) {
            console.log(error)
            
        }
    }
}


export default npmControllers