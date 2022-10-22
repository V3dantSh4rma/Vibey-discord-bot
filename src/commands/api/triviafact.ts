import { Command, CommandCategories, Vibey }              from "../../handlers";
import { CacheType, CommandInteraction }                  from "discord.js";
import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";
import axios, { AxiosResponse }                           from "axios";

const json = require("../../data/index.json");

export default class Triviafact extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("triviafact")
			.setDescription("Receive a random trivia fact.")
			.addIntegerOption(( int : SlashCommandIntegerOption ) =>
				int.setName("number")
				   .setDescription("The number you want to get the trivia fact of.")
				   .setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();

		try {
			const integer : number              = interaction.options.getInteger("number");
			const response : AxiosResponse<any> = await axios.get<string>(`${ process.env.FACTS_API }${ integer ?? "random" }/trivia`);
			await interaction.followUp(`\`\`\`${ response.data }\`\`\``);
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
