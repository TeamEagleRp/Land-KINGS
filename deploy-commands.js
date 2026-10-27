require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { DISCORD_TOKEN, CLIENT_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Fill DISCORD_TOKEN and CLIENT_ID in .env");
  process.exit(1);
}
const commands = [
  new SlashCommandBuilder().setName("ban").setDescription("Ban a member | حظر عضو")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder().setName("unban").setDescription("Unban a user | فك حظر")
    .addStringOption(o=>o.setName("user_id").setDescription("User ID | آيدي المستخدم").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder().setName("kick").setDescription("Kick a member | طرد عضو")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder().setName("timeout").setDescription("Timeout a member | تايم آوت")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addIntegerOption(o=>o.setName("minutes").setDescription("Minutes | المدة بالدقائق").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("untimeout").setDescription("Remove timeout | إزالة التايم آوت")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("warn").setDescription("Warn a member | تحذير عضو")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason | السبب").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("warnings").setDescription("View warnings | عرض التحذيرات")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("removewarn").setDescription("Remove a warning | إزالة تحذير")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addIntegerOption(o=>o.setName("warning_id").setDescription("Warning number | رقم التحذير").setMinValue(1).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  ...["clear","purge"].map(n=>new SlashCommandBuilder().setName(n).setDescription("Delete messages | حذف رسائل")
    .addIntegerOption(o=>o.setName("amount").setDescription("1 to 100 | من 1 إلى 100").setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)),
  new SlashCommandBuilder().setName("lock").setDescription("Lock channel | قفل الروم").setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("unlock").setDescription("Unlock channel | فتح الروم").setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("slowmode").setDescription("Set slowmode | ضبط السلو مود")
    .addIntegerOption(o=>o.setName("seconds").setDescription("0 to 21600 | من 0 إلى 21600").setMinValue(0).setMaxValue(21600).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("nick").setDescription("Change nickname | تغيير اللقب")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addStringOption(o=>o.setName("nickname").setDescription("New nickname; empty resets | اللقب الجديد").setmaxLength?.(32) || o.setMaxLength(32))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  ...["role-add","role-remove"].map(n=>new SlashCommandBuilder().setName(n).setDescription("Manage member role | إدارة رتبة عضو")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(true))
    .addRoleOption(o=>o.setName("role").setDescription("Role | الرتبة").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)),
  new SlashCommandBuilder().setName("line").setDescription("Post image only; hide command user | إرسال صورة دون إظهار المنفذ")
    .addAttachmentOption(o=>o.setName("image").setDescription("Image | الصورة").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("help").setDescription("Show all commands | عرض جميع الأوامر"),
  new SlashCommandBuilder().setName("level").setDescription("View level and progress | عرض المستوى والتقدم")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(false)),
  new SlashCommandBuilder().setName("coins").setDescription("View MG Coin balance | عرض رصيد MG Coin")
    .addUserOption(o=>o.setName("user").setDescription("Member | العضو").setRequired(false)),
  new SlashCommandBuilder().setName("daily").setDescription("Claim daily after Top.gg vote | اليومية بعد التصويت"),
  new SlashCommandBuilder().setName("leaderboard").setDescription("MG Coin leaderboard | قائمة MG Coin")
    .addStringOption(o=>o.setName("scope").setDescription("Server or global | السيرفر أو عام").setRequired(true)
      .addChoices({name:"Server | السيرفر",value:"server"},{name:"Global | عام",value:"global"}))
].map(c=>c.toJSON());

(async()=>{
  const rest = new REST({version:"10"}).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {body:commands});
  console.log(`Registered ${commands.length} GLOBAL commands. No guild ID used.`);
})().catch(e=>{console.error(e);process.exit(1);});