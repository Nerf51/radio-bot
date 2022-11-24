require("dotenv").config();
const { TOKEN, URL } = process.env;
const { Client, Intents, SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require("@discordjs/voice");
const { ChannelType } = require("discord-api-types/v10");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]
});


client.on("ready", async () => {
    //El código entre /**/ ejecutarlo solo una vez (para añadir los comandos globalmente)
    /*
    client.application.commands.create({
        name: "set-radio",
        description: "Set the channel bot will join",
        options: [{
            name: "channel",
            description: "Channel you want the bot joins in",
            type: "CHANNEL",
            required: true,
            channelTypes: [ChannelType.GuildVoice]
        }]
    })
    */
   console.log(`Bot iniciado: ${client.user.tag}`)
})

function joinChannel (channel){
    client.channels.fetch(channel).then(channel => {
        const VoiceConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });
        const resource = createAudioResource(URL, {
            inputType: StreamType.OggOpus
        });
        const player = createAudioPlayer({
            behaviors: NoSubscriberBehavior.Stop
        })
        VoiceConnection.subscribe(player);
        player.play(resource);
    }).catch(console.error);
}

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    if(interaction.commandName === "set-radio"){
        const channel = interaction.options.getChannel("channel");
        joinChannel(channel.id);
        await interaction.reply("El bot se ha unido correctamente");
    }
})


client.login(TOKEN);