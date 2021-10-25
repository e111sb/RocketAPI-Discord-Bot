import { Client, Intents } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

function getLaunches() {
    fetch('http://lldev.thespacedevs.com/2.2.0/launch')
    .then(response => response.json())
    .then(data => {
        console.log("wtf", data.results.id)
        const newData = data.results.map(obj => ({id :obj.id}))
        console.log(newData);
        
        
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
        getLaunches();
        console.log("rocket")
    }
    else if (splitMessageLength === 3) {
        console.log("rocket range")
    }
  }
});

client.login("");