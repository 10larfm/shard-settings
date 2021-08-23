//import the shardingmanager, from discord.js // shardingmanager'ı discord.js'den içe aktarın
const { ShardingManager } = require("discord.js");
//import the config file // yapılandırma dosyasını içe aktar
const config = require("./config.json");
//call the file, where your old start file was usually its called index.js // eski başlangıç dosyanızın genellikle index.js olarak adlandırıldığı dosyayı arayın
const shards = new ShardingManager("./index.js", {
  token: config.token, //paste your token in it // jetonunu içine yapıştır
  totalShards: "auto", //auto will create automatic shard amount per ~1000-1500 guilds (split everytime 2500 guilds is reached) // auto, ~1000-1500 lonca başına otomatik parça miktarı oluşturur (2500 loncaya her ulaşıldığında bölünür)
    //you can also define the amount of shards you want, then it will force to shard ;) | MUST BE A NUMBER FOR EXAMPLE: // ayrıca istediğiniz parça miktarını tanımlayabilirsiniz, o zaman parçayı zorlar ;) | ÖRNEĞİN BİR NUMARA OLMALIDIR:
              // totalShards : 3,
});
//once a shard is created log information --> note this will start the bot in index.js for the amount of shards you have! // bir parça oluşturulduktan sonra günlük bilgisi --> bunun, sahip olduğunuz parça miktarı için botu index.js'de başlatacağını unutmayın!
shards.on("shardCreate", shard => console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Launched Shard #${shard.id} || <==> ||`))
//spawn it
shards.spawn(shards.totalShards, 10000);