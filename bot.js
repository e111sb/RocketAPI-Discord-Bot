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
function getLaunches(channel, searchQuery) {
    let URL = "http://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=10";
    if (searchQuery) {
        URL = URL + "&search=" + searchQuery;
    }
    console.log(URL);
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        sendEmbeddedMessage(channel, parseData(data));
    })
    .catch((error) => {
        console.log(error);
        channel.send("Sorry, there was an error, please try again later.")
    });
}
function parseData(JSONToParse) {

    const currentTimeInMS = new Date().getTime();

    const newData = JSONToParse.results.map((obj) => {
        const launchDate = new Date(obj.net);
        const formattedLaunchDate = launchDate.toLocaleString({
            day : "numeric",
            month : "long",
            year : "numeric"
        });

        let daysToLaunch = Math.trunc((launchDate.getTime() - currentTimeInMS) / (1000 * 60 * 60 * 24));
        if (daysToLaunch < 0) {
            daysToLaunch = "Launched"
        }
        else if (daysToLaunch == 0) {
            daysToLaunch = "Today"
        }
        else {
            daysToLaunch = "Launch in: " + daysToLaunch + " days";
        }

        return {
            name : obj.rocket.configuration.family + " " + daysToLaunch,
            value : obj.rocket.configuration.name + "\n"
            + formattedLaunchDate + "\n"
            + obj.launch_service_provider.name
        }
    })
    return newData;
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!rocket") && !message.author.bot) {
    const splitMessage = message.content.split(" ");
    const splitMessageLength = splitMessage.length;
    if (splitMessageLength > 2) {
        message.channel.send("Your message contains too many attributes. Use \"!rocket help\" for details.");
    }
    else if (splitMessageLength === 1) {
        getLaunches(message.channel);
    }
    else if (splitMessageLength === 2) {
        if (splitMessage[1] !== "help") {
            getLaunches(message.channel, splitMessage[1])
        }
        else {
            message.channel.send("Please use just !rocket to get upcoming launches, or !rocket SearchTerm in order to search for specific organisations/rockets.");
        }
    }
    
  }
});

client.login(process.env.TOKEN);