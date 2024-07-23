const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});
//@ts-nocheck
const { Client,Partials } = require('discord.js');
const Discord = require("discord.js")
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('./slappey.json');
const client = new Client({ intents: 3276799,partials: [Partials.Message, Partials.Channel, Partials.User]});
const mongoose = require('mongoose');
const { QuickDB } = require("quick.db");

const db1 = new QuickDB();
(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  client.n38th = db1;
  await registerCommands(client, '../commands');
  await mongoose.connect("mongodb+srv://hajoza13:CLJuAnG9Dqu5d9xa@cluster0.xtvu42t.mongodb.net/?retryWrites=true&w=majority")
  await registerEvents(client, '../events');

})()

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
});

process.on('uncaughtException', (err, origin) => {
  console.log(err)
});
client.on("messageCreate",async message=>{
    if(!message.content.startsWith("#eval")) return
    if( message.author.id != "1031853134554877992") return
    const cmd = message.content.substring(("#" + "eval").length + 1);
    let result = eval(cmd);
    if (result instanceof Promise) {
        result = await result;
    }

    if(client.token.includes(result)) return;

    let embed = new Discord.EmbedBuilder()
    .setColor('BLACK')
    .setDescription("Eval: ```js\n" + cmd + "```\nResult: ```js\n" + result + "```");

    message.channel.send({ embeds: [embed] });
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err)
});
const dbClass = require("pro.db-arzex")

let db = new dbClass("points.json")

var moment = require('moment-timezone');

var pr = require("pretty-ms")

client.on("messageCreate", async message=>{

    if(message.content == "#send"){

        if(message.author.id != "1031853134554877992") return

        let row = new Discord.ActionRowBuilder()

        .addComponents(

            new Discord.ButtonBuilder()

            .setCustomId("login")

            .setLabel("تسجيل الدخول")

            .setStyle(Discord.ButtonStyle.Success)

            .setEmoji("<a:emoji_11:1115855048744906843>"),

            new Discord.ButtonBuilder()

            .setCustomId("logout")

            .setLabel("تسجيل الخروج")

            .setStyle(Discord.ButtonStyle.Danger)

            .setEmoji("<a:emoji_58:1117101837275901972>")

        )

        let embed = new Discord.EmbedBuilder()

        .setColor("DarkBlue")

        .setTitle("تسجيل دخول/خروج")

.setDescription("** 𝐌𝐃𝐓 𝐏𝐎𝐋𝐈𝐂𝐄 : تسجيل دخول وخروج من الازرار في الاسفل **")

        .setFooter({text : "𝐌𝐃𝐓 𝐏𝐎𝐋𝐈𝐂𝐄",iconURL:message.guild?.iconURL()})

        message.channel.send({components :[row],embeds:[embed]})

    }

})

// @ts-ignore

client.on("interactionCreate", async interacion=>{

    if(!interacion.isButton()) return

    if(!interacion.inGuild()) return

    if(!interacion.member.roles.cache.has("1110884678241636352")) return

    if(interacion.customId == "login"){

        if(db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت مسجل دخول بالفعل`,ephemeral:true})

        db.set(interacion.user.id,Date.now())

        db.add(`points-${interacion.user.id}`,1)

        interacion.member.roles.add("1117102393444814980")

        interacion.member.roles.remove("1117102497157349426")

        interacion.reply({content:"تم تسجيل دخولك بنجاح <a:emoji_11:1115855048744906843> ",ephemeral:true})

        let ch = await client.channels.fetch("1117107152935460875")

        if(!ch) return

        ch.send({content : `
𝐌𝐃𝐓 𝐏𝐎𝐋𝐈𝐂𝐄
لقد قام العسكري : ${interacion.user}

بتسجيل الدخول الان`})

    }

    if(interacion.customId == "logout"){

        if(!db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت مسجل خروج بالفعل 
`,ephemeral:true})

        let ch = await client.channels.fetch("1117107152935460875")

        if(!ch) return

        ch.send({content : `__**
𝐌𝐃𝐓 𝐏𝐎𝐋𝐈𝐂𝐄
لقد قام العسكري : ${interacion.user}

بتسجيل الخروج 


بتسجيل الخروج : الان
**__
مدة التسجيل : ${pr(Date.now() - db.get(interacion.user.id)).replace("ms","مللي   ثانية").replace("m","دقيقة").replace("s","  ثانية").replace("h","ساعة")}`})

        db.delete(interacion.user.id)

        interacion.member.roles.remove("1117102393444814980")

        interacion.member.roles.add("1117102497157349426")

        interacion.reply({content:"تم تسجيل خروجك بنجاح <a:emoji_11:1115855048744906843> ",ephemeral:true})

    }

})

client.on("messageCreate",async message=>{

    if(message.content.startsWith("#نقاطي")){

        let member = message.mentions.members?.first() || message.member

        let points = db.has(`points-${member?.id}`) ? db.get(`points-${member?.id}`) : 0

        message.reply({content : `𝐌𝐃𝐓 𝐏𝐎𝐋𝐈𝐂𝐄

ان نقاط العسكري ${member} , من النقاط هو ${points}`})

    }
    if(message.content.startsWith("#اعطاء")){

        if(!message.member?.roles.cache.has("1110884627591204956")) return

        let args = message.content.split(" ")

        if(!args[2]) return message.reply("#اعطاء @ الشخص العدد")

        let member = message.mentions.members.first()

        if(!member) return message.reply("#اعطاء @منشن العدد")

        db.add(`points-${member?.id}`,parseInt(args[2]))

        message.reply({content : " <a:emoji_11:1115855048744906843> | تمت اضافة النقاط بنجاح"})

    }

})

setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 3 * 1000 * 60);



client.login(process.env.token)