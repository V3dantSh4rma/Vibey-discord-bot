import { Command, CommandCategories, Vibey }                 from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption }       from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed, User } from "discord.js";
import axios, { AxiosResponse }                              from "axios";

const json = require("../../data/index.json");

export default class Hug extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("hug")
			.setDescription("Hug your dearest ones.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to hug")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user : ( User | null ) = interaction.options.getUser("user");
		const embed : MessageEmbed   = new MessageEmbed()
			.setTimestamp()
			.setColor("RANDOM");
		await interaction.deferReply();

		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.HUG_API as string);

			if ( !user ) {
				embed
					.setImage(res.data.url as string)
					.setTitle("I hug you つ ◕_◕༽つ");

				await interaction.followUp({ embeds : [ embed ] });
				return;
			}

			embed
				.setTitle(`${ interaction.user.username } hugs ${ user?.username } つ ◕_◕༽つ`)
				.setImage(res.data.url as string);


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
