import { MessageEmbed, Client, Intents } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config()



const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
function sendMessage(channel, newData) {
    const embed = new MessageEmbed()
    .setColor('#000000')
    .addFields(newData)
    .setFooter("\u2800".repeat(1000)+"|")
    channel.send({embeds : [embed]});
}
function getLaunches(channel) {
    return fetch('http://lldev.thespacedevs.com/2.2.0/launch/upcoming?limit=10')
    .then(response => response.json())
    .then(data => {
        const newData = data.results.map(obj => ({
            name : obj.rocket.configuration.full_name,
            value : obj.rocket.configuration.family + "\n"
             + obj.rocket.configuration.family}))
        sendMessage(channel, newData);
        
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!rocket") && !message.author.bot) {
    const splitMessage = message.content.split(" ");
    const splitMessageLength = splitMessage.length;
    if (splitMessageLength > 3) {
        message.channel.send("Your message contains too many attributes. Please use just !rocket to get upcoming launches, or !rocket StartDate EndDate for a date range.");
    }
    else if (splitMessageLength === 1) {
        getLaunches(message.channel);

    }
    else if (splitMessageLength === 3) {
        console.log("rocket range")
    }
  }
});

client.login(process.env.TOKEN);