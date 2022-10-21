import { Command, CommandCategories, Vibey }                 from "../../handlers/";
import { SlashCommandBuilder, SlashCommandUserOption }       from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed, User } from "discord.js";
import axios, { AxiosResponse }                              from "axios";

export default class Cuddle extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("cuddle")
			.setDescription("Cuddle you loved ones.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to cuddle.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();
		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.CUDDLE_API as string);
			const user : ( User | null )   = interaction.options.getUser("user");
			const embed : MessageEmbed     = new MessageEmbed()
				.setColor("RANDOM")
				.setTimestamp();

			if ( user ) {
				embed
					.setImage(res.data.url)
					.setTitle(`${ interaction.user.username } cuddles ${ user.username } (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`);

				await interaction.followUp({ embeds : [ embed ] });
				return;
			}

			embed
				.setImage(res.data.url as string)
				.setTitle(`I cuddle you. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`);
			await interaction.followUp({ embeds : [ embed ] });
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
