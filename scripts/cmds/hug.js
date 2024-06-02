const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")


module.exports = {
    config: {
        name: "hug",
        aliases: ["hug"],
        version: "1.0",
        author: "\4c\45\41\52\4e\20\54\4f\20\45\41\54\20\4c\45\41\52\4e\20\54\4f\20\53\50\45\41\4b\20\42\55\54\20\44\4f\4e\\54\20\54\52\59\20\54\4f\20\43\48\41\4e\47\45\20\54\48\45\20\43\52\45\44\49\54\20\41\4b\41\53\48",
        countDown: 5,
        role: 0,
        shortDescription: "mention someone",
        longDescription: "mention your love",
        category: "love",
        guide: "{pn}"
    },



    onStart: async function ({ message, event, args }) {
        const mention = Object.keys(event.mentions);
        if (mention.length == 0) return message.reply("Please mention someone");
        else {
            const one = event.senderID, two = mention[0];
            bal(one, two).then(ptth => { message.reply({ body: "You Are The Best", attachment: fs.createReadStream(ptth) }) })
        }
    }


};

async function bal(one, two) {

    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avone.circle()
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avtwo.circle()
    let pth = "hug.png"
    let img = await jimp.read("https://i.ibb.co/r7x6qY3/FB-IMG-16843165540829870-removebg-preview.png")

    img.resize(752, 708).composite(avone.resize(130, 130), 350, 380).composite(avtwo.resize(130, 130), 330, 140);

    await img.writeAsync(pth)
    return pth
          }