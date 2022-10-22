import { Command, CommandCategories, Vibey }             from "../../handlers";
import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed }   from "discord.js";

const json = require("../../data/index.json");

export default class Httpdog extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("httpdog")
			.setDescription("Receive a Dog Picture for every HTTP Status Code.")
			.addNumberOption(( num : SlashCommandNumberOption ) =>
				num
					.setMaxValue(999)
					.setRequired(true)
					.setName("status_code")
					.setDescription("The Status Code you want to receive a picture of.")
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<void>{
		await interaction.deferReply();
		const statusCode : number = interaction.options.getNumber("status_code");

		try {
			if ( statusCode < 100 ) {
				await interaction.followUp("The Number should be between 100-999");
				return;
			}

			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setImage(`https://http.dog/${ statusCode }.jpg`)
				.setTimestamp();

			await interaction.followUp({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.followUp({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
