import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import axios, { AxiosResponse }                        from "axios";

const json = require("../../data/index.json");

export default class Dog extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("dog")
			.setDescription("Receive a random Dog picture from the internet. 🐶 ");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();
		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.DOG_API as string);

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle(":dog:")
				.setTimestamp()
				.setColor("RANDOM")
				.setImage(res.data.message as string);

			await interaction.followUp({ embeds : [ embed ] });
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
