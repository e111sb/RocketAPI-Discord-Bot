import { MessageEmbed, Client, Intents } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config()



const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
function sendEmbeddedMessage(channel, newData) {
    const embed = new MessageEmbed()
    .setColor('#000000')
    .addFields(newData)
    .setFooter("\u2800".repeat(1000)+"|")
    channel.send({embeds : [embed]});
}
function getLaunches() {
    return fetch('http://lldev.thespacedevs.com/2.2.0/launch/upcoming?limit=10')
    .then(response => response.json())
    .then(data => {
        return parseData(data);
    })
    .catch((error) => {
        return error;
    });
}
function parseData(JSONToParse) {

    const currentTimeInMS = new Date().getTime();

    const newData = JSONToParse.results.map((obj) => {
        const launchDate = new Date(obj.net);

        let daysToLaunch = (launchDate.getTime() - currentTimeInMS) / (1000 * 60 * 60 * 24);
        if (daysToLaunch < 0) {
            daysToLaunch = "Launched"
        }
        else {
            daysToLaunch = "Launch in: " + Math.trunc(daysToLaunch) + " days";
        }
        return {
        
        name : obj.rocket.configuration.family + " " + daysToLaunch,
        value : obj.rocket.configuration.name + "\n"
         + ""
           + "\n"
        + obj.launch_service_provider.name}
    })
        console.log("e");
    return newData;
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
        getLaunches(message.channel).then(result => {
            if (result instanceof Error){
                console.log(result)
                message.channel.send("Sorry, there was an error, please try again later.")
            }
            else {
                console.log(result)
                sendEmbeddedMessage(message.channel, result);
            }
        });

    }
    else if (splitMessageLength === 3) {
        console.log("rocket range")
    }
  }
});

client.login(process.env.TOKEN);