import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";

export default class Invite extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("invite")
			.setDescription("Get the bot invite.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{

		try {
			const embed : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Invite`)
				.setDescription(`[Click me to invite!](https://discord.com/api/oauth2/authorize?client_id=${ client?.user?.id }&permissions=2184292416&scope=bot%20applications.commands)`)
				.setColor("RANDOM")
				.setTimestamp();

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
