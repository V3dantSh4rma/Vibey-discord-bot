import { Command, CommandCategories, Vibey }                        from "../../handlers";
import { SlashCommandBuilder }                                      from "@discordjs/builders";
import { CacheType, CommandInteraction, Guild, MessageEmbed, User } from "discord.js";

const json = require("../../data/index.json");

export default class Guilds extends Command {
	public category : CommandCategories = "INFORMATION";

	builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("guilds")
			.setDescription("Get the total guilds I am in.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {
			const guilds : Array<any> = [];

			client.guilds.cache.forEach(( g : Guild ) => {
				let user : ( User | undefined ) = client.users.cache.get(g.ownerId);
				guilds.push(new Object({ name : g.name, owner : user?.username + "#" + user?.discriminator }));
			});

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle("Total Guilds")
				.setColor("RANDOM")
				.setTimestamp()
				.setDescription(`\`\`\`${ guilds.map(a => a.name + " - " + a.owner).join("\n") }\`\`\``);

			await interaction.reply({ embeds : [ embed ] });
		} catch ( e : any ) {
			await interaction.reply({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
