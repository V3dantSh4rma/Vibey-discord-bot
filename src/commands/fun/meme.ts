import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import axios, { AxiosResponse }                        from "axios";


export default class Meme extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("meme")
			.setDescription("Generate a fresh meme from the internet.");
	};

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();

		try {
			const response : AxiosResponse<any> = await axios.get(`${ process.env.REDDIT_API }wholesomememes`);

			const embed : MessageEmbed = new MessageEmbed()
				//.setAuthor(`${response.data.title}`, `${interaction.user.avatarURL()}`, `${response.data.postLink}`)
				.setTitle(response.data.title)
				.setImage(response.data.url as string)
				.setColor("RANDOM");

			await interaction.followUp({ embeds : [ embed ] });
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
