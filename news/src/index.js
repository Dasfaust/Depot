const express = require("express");
const axios = require("axios");
const { toHTML } = require("@odiffey/discord-markdown");
const { renderBlock } = require("blocks-html-renderer");
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require('fs')
const minestat = require('minestat');

console.log("Depot News: starting...");

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
        return GatewayIntentBits[a]
    }),
});

const app = express();

function parseDiscordMessages(messageList) {
  var html = "<div class='messageBlock'>";

  var count = 0;
  messageList.map((message) => {
    count++;
    
    html += toHTML(message.content, {
      discordCallback: {
        channel: node => `<a href='discord://discord.com/channels/${client.channels.cache.get(node.id).guildId}/${node.id}'>#${client.channels.cache.get(node.id).name}</a>`,
        user: node => "@" + client.users.cache.get(node.id).name,
        role: node => "@" + message.guild.roles.cache.get(node.id).name
      }
    });
  });

  if (count == 0) {
    html += "<i>There's currently no messages</i>";
  }

  return html + "</div>";
}

async function getServerStatus(address, port) {
  var result;

  try {
    result = await minestat.init({address: address, port: port});
  } catch(e) {
    console.log("warning: server status failed");
    console.log(e);
  }

  if (result != null && result.online) {
    if (result.motd.toLowerCase().includes("maintenance")) {
      return `<div class='serverStatusMaintenance'><strong>⚡</strong> Maintenance mode</div>`;
    } else {
      return `<div class='serverStatusOnline'><strong>⚡</strong> ${result.current_players} / ${result.max_players} players</div>`;
    }
  }

  return "<div class='serverStatusOffline'><strong>⚡</strong> Offline</div>";
}

function loadHeader() {
  const style = fs.readFileSync("./public/style.css").toString();
  return `<!DOCTYPE html><html><head><style>${style}</style></head><body>`;
}

const htmlFooter = "</body></html>"

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(process.env.DEPOT_LAUNCHER_API_URL + "/news");
    const announcementsChannel = client.channels.cache.get(result.data.discordAnnouncementsChannelId);
    const announcementsMessages = await announcementsChannel.messages.fetch({ limit: 1 });
    const changelogChannel = client.channels.cache.get(result.data.discordChangelogChannelId);
    const changelogMessages = await changelogChannel.messages.fetch({ limit: 1 });

    var html = loadHeader();

    html += `<div class='messageBlockHeader'><a href='discord://discord.com/channels/${changelogChannel.guildId}/${result.data.discordAnnouncementsChannelId}'>#${announcementsChannel.name}</a></div>`;
    html += parseDiscordMessages(announcementsMessages);

    html += `<div class='messageBlockHeader'><a href='discord://discord.com/channels/${changelogChannel.guildId}/${result.data.discordChangelogChannelId}'>#${changelogChannel.name}</a></div>`;
    html += parseDiscordMessages(changelogMessages);

    res.status(200).send(html + htmlFooter);
  } catch(e) {
    res.status(500).send(e.data);
    console.log(e);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const result = await axios.get(process.env.DEPOT_LAUNCHER_API_URL + `/news/${req.params.id}`);
    const changelogChannel = client.channels.cache.get(result.data.discordChangelogChannelId);
    const changelogMessages = await changelogChannel.messages.fetch({ limit: 1 });
    const chatChannel = client.channels.cache.get(result.data.discordChatChannelId);
    const pinnedMessages = await chatChannel.messages.fetchPinned({ limit: 1 });

    var html = loadHeader(html + htmlFooter);
    var infoChannelName = client.channels.cache.get(result.data.discordInfoChannelId).name;
    var serverStatus = await getServerStatus(result.data.serverAddress, result.data.serverPort);
    html += `<div class='welcomeBlock'><div class='domainStatus'>${serverStatus}<div class='domainLink'><span><a href='discord://discord.com/channels/${changelogChannel.guildId}/${result.data.discordInfoChannelId}'><span>#${infoChannelName}</span></a></div></div>`;
    var welcome = renderBlock(result.data.description);
    html += welcome + "</div>";

    html += `<div class='messageBlockHeader'><a href='discord://discord.com/channels/${changelogChannel.guildId}/${result.data.discordChatChannelId}'>#${chatChannel.name}: 📌</a></div>`;
    html += parseDiscordMessages(pinnedMessages);

    html += `<div class='messageBlockHeader'><a href='discord://discord.com/channels/${changelogChannel.guildId}/${result.data.discordChangelogChannelId}'>#${changelogChannel.name}</a></div>`;
    html += parseDiscordMessages(changelogMessages);

    res.status(200).send(html + htmlFooter);
  } catch(e) {
    res.status(500).send(e.data);
    console.log("fatal: API request failed");
    console.log(e);
  }
});

client.on("ready", (client) => {
  console.log(`${client.user.tag}: ready to take over the world. Mwahahaha! Hah! Hah! ...Hah! *caugh*`);
  app.listen(3000);
  console.log("Depot News: ready");
});


client.login(process.env.DISCORD_BOT_TOKEN);