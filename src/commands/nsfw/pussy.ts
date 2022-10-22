import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CommandInteraction, MessageEmbed }  from "discord.js";
import axios, { AxiosResponse }              from "axios";

const json = require("../../data/index.json");

export default class Pussy extends Command {
	public category : CommandCategories = "NSFW";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("clits")
			.setDescription("Receive Vagina pics to complete your thirst.");
	};

	public async handle( interaction : CommandInteraction, client : Vibey ) : Promise<any>{
		try {
			const clits : Array<string>         = [ "pussy", "vagina", "ClitGw" ];
			const randomSubreddit : string      = clits[ Math.floor(Math.random() * clits.length) ];
			const response : AxiosResponse<any> = await axios.get(`${ process.env.REDDIT_API }${ randomSubreddit }`);
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
