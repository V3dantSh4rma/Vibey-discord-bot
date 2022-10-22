import { SlashCommandBuilder }               from "@discordjs/builders";
import { Command, CommandCategories, Vibey } from "../../handlers";
import { CommandInteraction, MessageEmbed }  from "discord.js";
import axios, { AxiosResponse }              from "axios";

const json = require("../../data/index.json");

export default class Porngif extends Command {
	public category : CommandCategories = "NSFW";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("porngif")
			.setDescription("Ask and you shall receive the gif.");
	}

	public async handle( interaction : CommandInteraction, client : Vibey ) : Promise<any>{
		try {
			await interaction.deferReply();
			const gifArr : Array<string>        = [ "redgifs", "PornGifs", "porngifsmyfavorites" ];
			const randomSubr : string           = gifArr[ Math.floor(Math.random() * gifArr.length) ];
			const response : AxiosResponse<any> = await axios.get(`${ process.env.REDDIT_API }${ randomSubr }`);

			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setAuthor(`${ response.data.title }`, `${ interaction.user.avatarURL() }`, `${ response.data.postLink }`)
				.setImage(response.data.url as string)
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
