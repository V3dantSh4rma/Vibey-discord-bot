import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CacheType, CommandInteraction }     from "discord.js";
import axios, { AxiosResponse }              from "axios";

export default class Advice extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("advice")
			.setDescription("Get an advice from the bot.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();
		try {
			const response : AxiosResponse<any> = await axios.get(process.env.ADVICE_URL as string);

			await interaction.followUp(`${ response.data.slip.advice }`);
		} catch ( e ) {
			await interaction.followUp({
				content   : "There was an error in executing the command. I have told the developers about it.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
