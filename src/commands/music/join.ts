import { Command, CommandCategories, Vibey }                            from "../../handlers";
import { SlashCommandBuilder }                                          from "@discordjs/builders";
import { AnyChannel, CacheType, CommandInteraction, VoiceBasedChannel } from "discord.js";
import { DiscordGatewayAdapterCreator, joinVoiceChannel }               from "@discordjs/voice";

export default class Join extends Command {
	public category : CommandCategories = "MUSIC";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("join")
			.setDescription("Let the bot join your voice channel.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user                                          = interaction?.guild?.members.cache.get(interaction.user.id as string);
		const vc : ( VoiceBasedChannel | null | undefined ) = user?.voice.channel;

		try {
			if ( !vc ) {
				await interaction.reply("You must be in a voice channel to use this command.");
				return;
			}

			if ( interaction?.guild?.me?.voice.channelId === vc?.id ) {
				await interaction.reply("I am already in your voice channel.");
				return;
			}

			client.channels.fetch(`${ vc?.id }`).then(( c : AnyChannel | null ) => {
				joinVoiceChannel({
					channelId      : vc?.id as ( string ),
					guildId        : interaction.guildId as ( string ),
					adapterCreator : interaction?.guild?.voiceAdapterCreator as ( DiscordGatewayAdapterCreator )
				});
			});
			await interaction.reply("Joined your voice channel.");

		} catch ( e ) {
			console.log(e);
			await interaction.reply({
				content   : "There was an error in executing the command. I have told the developers about it.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
