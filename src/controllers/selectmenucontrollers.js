import { ActionRowBuilder, SelectMenuBuilder } from 'discord.js'

let arr = ['Pizza', 'Hambuerger', 'French Fries', 'Salmon', 'Goat Cheese']


const selectMenuControllers = {
    FoodSelector: function(interaction){
       const foodSelector = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder().setCustomId("food_options").setOptions(arr.map(el => ( 
              {label: el, value: el}) ))
          );
    
          interaction.reply({components: [foodSelector.toJSON()]})



    }

} 


export default selectMenuControllers