const Discord = require("discord.js");
//import the config file // yapılandırma dosyasını içe aktar
const config = require("./config.json");
//create a new Client // yeni bir kimlik oluştur
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
//READY EVENT // HAZIRLANMA OLAYI
client.on("ready", () => {
  console.log(`${client.user.tag} Is now ready use. WAIT FOR ALL SHARDS TO GET READY!`);
  change_status(client);
  setInterval(()=>{
    change_status(client);
  }, 15 * 1000);
})
//MESSAGE EVENT // MESAJ OLAYI
client.on("message", async message => {
//Ignore all bots and not guilds // Sunucuları değil, tüm botları yoksay
  if (message.author.bot || !message.guild) return;
  //Ignore messages not starting with the prefix // Önekle başlamayan iletileri yoksay
  if (message.content.indexOf(config.prefix) !== 0) return;
  //Our standard argument/command name definition. // Standart argüman/komut adı tanımımız
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  //If that command doesn't exist, silently exit and do nothing // Bir komut yoksa, çık ve hiçbir şey yapma
  if (!cmd.length) return;

  switch(cmd){
    case "ping":
      {
        const msg = await message.channel.send(`🏓 Pinging....`);
        msg.edit(`🏓 Pong!\nGecikme \`${Math.round(client.ws.ping)}ms\``);
      }
    break;
    case "yaz":
      {
        if(!args[0]) return message.reply("Lütfen yazmak istediklerinizi ekleyin.")
        message.channel.send(args.join(" "))
      }
    break;
    case "istatistik":
      {
        const promises = [
          client.shard.fetchClientValues('guilds.cache.size'),
          client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
        ];
        return Promise.all(promises).then(async results => {
          const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
          const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
          let guilds = [], users = [];
          let counter = 0;
          for(let item of results[0]) guilds.push(`Shard #${counter++}: ${item} Sunucu`)
          counter = 0;
          for(let item of results[1]) users.push(`Shard #${counter++}: ${item} Kullanıcı`)

          message.channel.send(`**📁 Kullanıcı:** \`Toplam: ${totalMembers} Kullanıcı\`\n\`\`\`fix\n${users.join("\n")}\n\`\`\`\n\n**📁 Sunucu:** \`Toplam: ${totalGuilds} Sunucu\`\n\`\`\`fix\n${guilds.join("\n")}\n\`\`\``);
        }).catch(console.error);
      }
    break;
    default:
      {
        message.reply(`Bilinmeyen komut. Bulunan komutlar: \`${config.prefix}ping\`, \`${config.prefix}say\`, \`${config.prefix}info\``)
      }
    break;
  }
});
//login to the BOT // BOT'a giriş yapın
client.login(config.token);
//FUNCTION TO CHAGNE THE STATUS // DURUM DEĞİŞTİRME FONKSİYONU
function change_status(client){
  try{
    const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
		];
		return Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        for(const shard of client.shard.ids)
          //custom status per shard // parça başına özel durum ;)
        client.user.setActivity(`botlands.com | #${shard} Shard | ${totalGuilds} Sunucu | ${Math.ceil(totalMembers/1000)}k Kullanıcı`, {type: "WATCHING", shardID: shard});
			}).catch(console.error);
  }catch (e) {
      client.user.setActivity(`botlands.com | #0 Shard | ${client.guilds.cache.size} Sunucu | ${Math.ceil(client.users.cache.size/1000)}k Kullanıcı`, {type: "WATCHING", shardID: 0});
  }
}