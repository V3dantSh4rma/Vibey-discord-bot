import { SlashCommandBuilder }               from "@discordjs/builders";
import { CacheType, CommandInteraction }     from "discord.js";
import { Command, CommandCategories, Vibey } from "../../handlers";
import axios, { AxiosResponse }              from "axios";

export default class Darkjoke extends Command {
	public category? : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("darkjoke")
			.setDescription("Generate a funny yet a dark joke.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();

		try {
			const response : AxiosResponse<any> = await axios.get<string>(process.env.DARKJOKE_API);

			if ( response.data.type == "single" ) {
				await interaction.followUp(`||${ response.data.joke }||`);
				return;
			}

			await interaction.followUp(`||${ response.data.setup }||\n||${ response.data.delivery }||`);
			return;
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
