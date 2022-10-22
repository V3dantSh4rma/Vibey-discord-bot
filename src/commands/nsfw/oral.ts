import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CommandInteraction, MessageEmbed }  from "discord.js";
import axios, { AxiosResponse }              from "axios";

const json = require("../../data/index.json");

export default class Oral extends Command {
	public category : CommandCategories = "NSFW";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("oralsex")
			.setDescription("Receive an Oral Pleasure content");
	}

	public async handle( interaction : CommandInteraction, client : Vibey ){
		try {
			await interaction.deferReply();
			const oralArr : Array<string>       = [ "OralPleasure", "OralCreampie" ];
			const random : string               = oralArr[ Math.floor(Math.random() * oralArr.length) ];
			const response : AxiosResponse<any> = await axios.get(`${ process.env.REDDIT_API }${ random }`);

			const embed : MessageEmbed = new MessageEmbed()
				.setAuthor(`${ response.data.title }`, `${ interaction.user.avatarURL() }`, `${ response.data.postLink }`)
				.setColor("RANDOM")
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
