import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import os                                              from "os";

export default class Stats extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("stats")
			.setDescription("Get the Bot information.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {
			const totalGuilds : number = client.guilds.cache.size;
			const totalUsers : number  = client.users.cache.size;
			const totalRam : string    = ( os.totalmem() / 10 ** 6 + "" ).split(".")[ 0 ];
			const freeram : string     = ( ( os.freemem() / 10 ** 6 + " " ).split(".")[ 0 ] );
			const usedram : string     = ( ( ( os.totalmem() - os.freemem() ) / 10 ** 6 + " " ).split(".")[ 0 ] );
			const system : string      = os.platform();

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle("Bot Statistics")
				.addFields(
					{
						name   : "> Bot stats",
						value  : `\`\`\`- Total Guilds: ${ totalGuilds }\n- Total Users: ${ totalUsers }\`\`\``,
						inline : false
					},

					{
						name   : "> Os Stats",
						value  : `\`\`\`- Used Ram: ${ usedram } / ${ totalRam }gb\n- Free Ram: ${ freeram }gb\n- Operating System: ${ system }\`\`\``,
						inline : false
					}
				)
				.setColor("RANDOM")
				.setTimestamp();

			await interaction.reply({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.reply({
				content   : "There was an error in executing the command. I have told the developers about it.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
