import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, User }         from "discord.js";
import axios, { AxiosResponse }                        from "axios";

export default class Compliment extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("compliment")
			.setDescription("Compliment someone!")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setRequired(false)
					.setDescription("The user to compliment")
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user : ( User | null ) = interaction.options.getUser("user");
		await interaction.deferReply();
		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.COMPLIMENT_API as string);

			if ( user ) {
				await interaction.followUp(`<@!${ user.id }>, ${ res.data.compliment }`);
				return;
			}

			await interaction.followUp(res.data.compliment);
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
