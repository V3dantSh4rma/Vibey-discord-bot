import { Command, CommandCategories, Vibey }                from "../../handlers";
import { SlashCommandBuilder }                              from "@discordjs/builders";
import { CacheType, CommandInteraction, VoiceBasedChannel } from "discord.js";

const json = require("../../data/index.json");

export default class Pause extends Command {
	public category : CommandCategories = "MUSIC";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("pause")
			.setDescription("Pause the current playing music.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const vc : ( VoiceBasedChannel | null | undefined ) = interaction.guild?.members.cache.get(interaction.id)?.voice.channel;
		await interaction.deferReply();

		try {
			if ( !vc ) {
				await interaction.followUp({ content : "You have to be in a voice channel to use this command." });
				return;
			}

			if ( !interaction?.guild?.me?.voice.channel ) {
				await interaction.followUp({ content : "I am not in a Voice Channel currently." });
				return;
			}

			if ( vc!.id !== interaction!.guild!.me!.voice!.channel!.id ) {
				await interaction.followUp({ content : "You have to be in the same voice channel as me to use this command." });
				return;
			}
			await interaction.followUp({ content : "Successfully Paused the player." });
		} catch ( e ) {
			await interaction.reply({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
