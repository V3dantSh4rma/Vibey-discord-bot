import { Command, CommandCategories, Vibey }           from "../../handlers/";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, User }         from "discord.js";
import axios, { AxiosResponse }                        from "axios";

const json = require("../../data/index.json");

export default class Yomomma extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("yomomma")
			.setDescription("Yo momma so fat.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to use this command on.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<void>{
		await interaction.deferReply();

		try {
			const user : ( User | null )   = interaction.options.getUser("user");
			const res : AxiosResponse<any> = await axios.get<string>(process.env.YOMOMMA_API as string);

			if ( user ) {
				await interaction.followUp(`<@!${ user.id }>, ${ res.data.joke }`);
			}

			await interaction.followUp(`${ res.data.joke }`);
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
