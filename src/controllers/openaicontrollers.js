
import { Embed, EmbedBuilder } from 'discord.js';
import openaiConfig from '../config/openai.js';



const openAiControllers = {
    prompt: async function(interaction){
        const openai = openaiConfig()
        
        const prompt = interaction.options.getString('prompt') 
        const secondary = " and please wrap the code blocks in back ticks and provide syntax highlighting for Discord?"
        
try {
    await interaction.deferReply()
    const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt + secondary,
        max_tokens: 500,
        temperature: 0.9
        
        })
        const answer = result.data.choices[0].text


        

        console.log(result.data.choices)
       if(answer){
        const embed = new EmbedBuilder()
        .setTitle(prompt).setDescription(answer)
        interaction.editReply({embeds: [embed]})
        
       }

    
} catch (error) {
    console.log(error)
    
}
    


       
    }


}

export default openAiControllers