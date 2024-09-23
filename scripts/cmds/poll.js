module.exports = {
  config: {
    name: "poll",
    aliases: ["vote"],
    version: "1.2",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Create an interactive poll",
    longDescription: "Create an interactive poll with customizable options.",
    category: "utility",
    guide: {
      en: "{p}poll [question] | [option1] | [option2] | ... | [duration in minutes]"
    }
  },

  onStart: async function ({ api, args, event, message }) {
    // Validate author name
    if (this.config.author !== "Raphael ilom") {
      return message.reply("Unauthorized modification detected. The author name cannot be changed.");
    }

    const { threadID } = event;
    const input = args.join(' ').split('|').map(item => item.trim());

    if (input.length < 3) {
      return message.reply("Please provide a question and at least two options.");
    }

    const [question, ...optionsAndDuration] = input;
    const duration = parseInt(optionsAndDuration[optionsAndDuration.length - 1]);
    const options = isNaN(duration) ? optionsAndDuration : optionsAndDuration.slice(0, -1);

    if (options.length < 2 || options.length > 10) {
      return message.reply("Please provide between 2 and 10 options.");
    }

    const pollDuration = isNaN(duration) ? 5 : Math.min(Math.max(duration, 1), 1440);
    let pollMessage = `📊 Poll: ${question}\n\n`;

    options.forEach((option, index) => {
      pollMessage += `${index + 1}. ${option}\n`;
    });

    pollMessage += `\nPoll duration: ${pollDuration} minute(s)`;

    const reactions = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];
    const votes = new Map();

    const info = await api.sendMessage(pollMessage, threadID);

    for (let i = 0; i < options.length; i++) {
      await api.setMessageReaction(reactions[i], info.messageID);
    }

    const pollEndTime = Date.now() + pollDuration * 60000;

    const checkPollEnd = setInterval(async () => {
      if (Date.now() >= pollEndTime) {
        clearInterval(checkPollEnd);
        const pollResults = await calculateResults(options, votes);
        api.sendMessage(pollResults, threadID, info.messageID);
      }
    }, 10000);

    api.listenMqtt((err, event) => {
      if (err) return console.error(err);

      if (event.type === "message_reaction" && event.messageID === info.messageID) {
        const reactionIndex = reactions.indexOf(event.reaction);
        if (reactionIndex !== -1) {
          const userID = event.userID;
          votes.set(userID, reactionIndex);
        }
      }
    });
  }
};

async function calculateResults(options, votes) {
  const results = new Array(options.length).fill(0);
  votes.forEach((optionIndex) => {
    results[optionIndex]++;
  });

  let resultMessage = "📊 Poll Results:\n\n";
  const totalVotes = results.reduce((sum, count) => sum + count, 0);

  options.forEach((option, index) => {
    const voteCount = results[index];
    const percentage = totalVotes > 0 ? (voteCount / totalVotes * 100).toFixed(2) : 0;
    resultMessage += `${index + 1}. ${option}: ${voteCount} vote(s) (${percentage}%)\n`;
  });

  resultMessage += `\nTotal votes: ${totalVotes}`;

  return resultMessage;
  }
