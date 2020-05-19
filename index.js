require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core-discord");
const prefix = "!";
let messagePrivate = require("./message");

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const userCommand = args.shift().toLowerCase();

  const commands = {
    "191": () =>
      msg.channel.send(
        "Olá, você ligou para polícia federal qual seria a denúncia?"
      ),
    sair: () => {
      if (msg.member.voiceChannel) msg.member.voiceChannel.leave();
    },
    denuncia: async () => {
      if (!args.length) {
        msg.channel.send("Por favor informar qual é a  denúncia!");
      } else {
        msg.channel.send("Estamos mandando as viaturas já!");
        msg.channel.send("https://static.poder360.com.br/2019/08/giphy-2.gif");
        await msg.member.voiceChannel.join();
        msg.member.voiceChannel.connection.playOpusStream(
          await ytdl("https://www.youtube.com/watch?v=9QXQe08U-GA")
        );
        const user = msg.mentions.users.first();
        if (user) {
          let motivo = msg.cleanContent
            .replace(msg.mentions.users.first().username, "")
            .replace("!denuncia", "")
            .replace("@", "");
          await user.send(messagePrivate.sendDmMessage(user.username, motivo));
        }
      }
    },
    clear: () => {
      if (msg.member.hasPermission("MANAGE_MESSAGES")) {
        msg.channel.fetchMessages().then(
          function (list) {
            msg.channel.bulkDelete(list);
          },
          function (err) {
            msg.channel.send("ERROR: ERROR CLEARING CHANNEL.");
          }
        );
      }
    },
  };

  if (commands[userCommand]) {
    let fn = commands[userCommand];
    fn();
  }
});
