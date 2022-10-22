import { audioPlayer, Command, CommandCategories, Vibey }                                     from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption }                                      from "@discordjs/builders";
import { AnyChannel, CacheType, CommandInteraction, MessageEmbed, VoiceBasedChannel }         from "discord.js";
import { AudioResource, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import * as play                                                                              from "play-dl";
import { SoundCloudStream, YouTubeStream, YouTubeVideo }                                      from "play-dl";

const json = require("../../data/index.json");

export default class Play extends Command {
	public category : CommandCategories = "MUSIC";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("play")
			.setDescription("Play a music in your voice channel.")
			.addStringOption(( option : SlashCommandStringOption ) =>
				option
					.setName("query")
					.setDescription("The music which you wanna play.")
					.setRequired(true)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const query : ( string )                            = interaction.options.getString("query");
		const vc : ( VoiceBasedChannel | null | undefined ) = interaction.guild!.members.cache.get(interaction.user.id as string)?.voice.channel;
		let voiceConnection : any;
		await interaction.deferReply();

		try {
			if ( !vc ) {
				await interaction.followUp("You have to be in a voice channel to use this command.");
				return;
			}

			voiceConnection = client.channels.fetch(vc.id as string).then(( channel : ( AnyChannel | null ) ) => {
				voiceConnection = joinVoiceChannel({
					channelId      : vc.id as string,
					guildId        : interaction.guildId as string,
					adapterCreator : interaction?.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
				});
			});

			const search : YouTubeVideo[] = await play.search(query as string, {
				limit : 1
			});

			const stream : ( YouTubeStream | SoundCloudStream ) = await play.stream(search[ 0 ].url);

			const resource : AudioResource = createAudioResource(stream.stream, {
				inputType : stream.type
			});

			audioPlayer.play(resource);
			voiceConnection.subscribe(audioPlayer);
			resource.volume?.setVolume(60);

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle("Now Playing...")
				.addField("🎵 Song", `${ search[ 0 ].title }`, false)
				.addField("🤠 Channel", `${ search[ 0 ].channel }`, false)
				.addField("👀 Views", `${ search[ 0 ].views.toLocaleString("en-US") }`, false)
				.addField("📎 Youtube", `${ search[ 0 ].url }`)
				.setTimestamp()
				.setColor("RANDOM")
				.setThumbnail("https://i.gifer.com/Nt6v.gif");

			await interaction.followUp({ embeds : [ embed ] });

			//await interaction.followUp(`${ resource.playbackDuration }`);
		} catch ( e ) {
			await interaction.followUp({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
		}
	}
}
