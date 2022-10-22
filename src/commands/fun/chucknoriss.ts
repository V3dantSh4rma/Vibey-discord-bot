import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import axios, { AxiosResponse }                        from "axios";

const json = require("../../data/index.json");

export default class Chucknorris extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("chucknorris")
			.setDescription("Generate a Chuck Norris themed joke.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<void>{
		await interaction.deferReply();
		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.CHUCK_NORISS_API as string);

			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(res.data.value as string)
				.setThumbnail(res.data.icon_url);


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
