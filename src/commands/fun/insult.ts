import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, User }         from "discord.js";
import axios, { AxiosResponse }                        from "axios";

export default class Insult extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("insult")
			.setDescription("Insult yourself or your dear ones.")
			.addUserOption(( user : SlashCommandUserOption ) => {
				return user
					.setName("user")
					.setDescription("The user you want to insult.")
					.setRequired(false);
			});
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();

		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.INSULT_API as string);
			const user : ( User | null )   = interaction.options.getUser("user");

			if ( user ) {
				await interaction.followUp(`<@!${ user.id }>, ${ res.data.insult }`);
				return;
			}

			await interaction.followUp(`${ res.data.insult }`);
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
