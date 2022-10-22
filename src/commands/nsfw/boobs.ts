import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CommandInteraction, MessageEmbed }  from "discord.js";
import axios, { AxiosResponse }              from "axios";

const json = require("../../data/index.json");

export default class Boobs extends Command {
	public category : CommandCategories = "NSFW";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("boobs")
			.setDescription("Receive Boob pics from the internet.");
	}

	public async handle( interaction : CommandInteraction, client : Vibey ){
		try {
			const response : AxiosResponse<any> = await axios.get(`${ process.env.REDDIT_API }boobs`);
			await interaction.deferReply();

			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setAuthor(`${ response.data.title }`, `${ interaction.user.avatarURL() }`, `${ response.data.postLink }`)
				.setImage(response.data.url as string);

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
