module.exports = {
  config: {
    name: "members",
    aliases: ["memberlist"],
    version: "1.0",
    author: "Elohime hatake",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "bot - Get member list",
      tl: "bot - Kunin ang listahan ng mga miyembro"
    },
    longDescription: {
      en: "bot - Get the list of all members of the group",
      tl: " bot - Kunin ang listahan ng lahat ng mga miyembro ng grupong ito"
    },
    category: "Elocmd",
    guide: {
      en: "{p}members",
      tl: "{p}memberlist"
    },
  },

  onStart: async function({ event, message, senderID, threadsData, usersData, api, commandName, role }) {
    if (commandName === "members") {
      const threadID = event.threadID;
      const threadInfo = await api.getThreadInfo(threadID);
      const memberList = threadInfo.participantIDs;

      let members = "Member List:\n";
      for (const memberID of memberList) {
        const memberInfo = await api.getUserInfo(memberID);
        const memberName = memberInfo[memberID].name;
        members += `${memberName} (${memberID})\n`;
      }

      message.reply(members);
    }
  }
}