require("dotenv").config();
module.exports = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  topggToken: process.env.TOPGG_TOKEN || "",
  topggBotId: process.env.TOPGG_BOT_ID || process.env.CLIENT_ID || "",
  unlimitedCoinUsers: [
    "1443579668195315844",
    "1546121686200352819"
  ],,
  dataFile: "./data/database.json"
};