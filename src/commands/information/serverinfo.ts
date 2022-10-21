import { Command, CommandCategories, Vibey }                                           from "../../handlers";
import { SlashCommandBuilder }                                                         from "@discordjs/builders";
import { CacheType, CommandInteraction, GuildBasedChannel, GuildMember, MessageEmbed } from "discord.js";

export default class Serverinfo extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("serverinfo")
			.setDescription("Get the server info.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const embed : MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setTimestamp();

		let textChannels : number  = 0;
		let voiceChannels : number = 0;

		try {

			interaction?.guild?.channels.cache.forEach(( channel : GuildBasedChannel ) => {
				if ( channel.type === "GUILD_TEXT" ) {
					textChannels++;
				} else if ( channel.type === "GUILD_VOICE" ) {
					voiceChannels++;
				}
			});

			embed
				.addField("> Guild", interaction!.guild!.name, false)
				.addField("> Owner", `${ await interaction?.guild?.fetchOwner() }`, false)
				.addField("> Guild ID", `${ interaction?.guild?.id }`, false)
				.addField("> Icon", `[Click me](${ interaction?.guild?.iconURL() })`)
				.addField("> Guild Bans", `${ interaction?.guild?.bans?.cache?.size }` || "No Bans.", false)
				.addField("> Total Members", `${ interaction.guild!.members.cache.size }`, false)
				.addField("> Bots", `${ interaction?.guild?.members.cache.filter(( user : GuildMember ) => user.user.bot).size || "No Bots" }`, false)
				.addField("> Total Text Channels", `${ textChannels }` || "No Text Channels.", false)
				.addField("> Total Voice Channels", `${ voiceChannels }` || "No Voice Channels.", false);

			await interaction.reply({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.reply({
				content   : "There was an error in executing the command. I have told the developers about it.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}

}
