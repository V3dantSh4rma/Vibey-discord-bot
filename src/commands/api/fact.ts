import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CacheType, CommandInteraction }     from "discord.js";
import axios, { AxiosResponse }              from "axios";


export default class Fact extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("fact")
			.setDescription("Generate a weird yet interesting fact.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();
		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.FACT_API as string);

			await interaction.followUp(res.data.fact);
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
