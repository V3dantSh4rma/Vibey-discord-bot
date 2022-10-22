import { Command, CommandCategories, Vibey }                 from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption }       from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed, User } from "discord.js";
import axios, { AxiosResponse }                              from "axios";

const json = require("../../data/index.json");

export default class Hug extends Command {
	public category : CommandCategories = "API";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("poke")
			.setDescription("Poke the dearest ones you know")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to hug")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();
		const user : ( User | null ) = interaction.options.getUser("user");
		const embed : MessageEmbed   = new MessageEmbed()
			.setTimestamp()
			.setColor("RANDOM");

		try {
			const res : AxiosResponse<any> = await axios.get<string>(process.env.POKE_API as string);

			if ( !user ) {
				embed
					.setImage(res.data.url as string)
					.setTitle("I poke you");

				await interaction.followUp({ embeds : [ embed ] });
				return;
			}

			embed
				.setTitle(`${ interaction.user.username } pokes ${ user?.username }!`)
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
