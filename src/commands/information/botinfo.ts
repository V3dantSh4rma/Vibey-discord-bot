import { Command, CommandCategories, Vibey }                                    from "../../handlers";
import { SlashCommandBuilder }                                                  from "@discordjs/builders";
import { CacheType, CommandInteraction, Guild, GuildEmoji, MessageEmbed, User } from "discord.js";

const json = require("../../data/index.json");

export default class Botinfo extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("botinfo")
			.setDescription("Get the bot info.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {
			const guildId : Guild = client.guilds.cache.get("780433753762955314");

			const tsEmoji : GuildEmoji      = guildId?.emojis.cache.find(emoji => emoji.name === "typescript");
			//format - `<:${tsEmoji?.name}:${tsEmoji?.id}>`
			const discordEmoji : GuildEmoji = guildId?.emojis.cache.find(emoji => emoji.name === "discord");
			const owner : User              = client.users.cache.get("554301512227094528");

			function getAccessibleCommands() : number{
				return client.commands.filter(( command : Command ) => !command.dev).size;
			}

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Information`)
				.setTimestamp()
				.setColor("RANDOM")
				.addFields(
					{ name : "> Username", value : `${ client.user?.username }`, inline : false },
					{
						name : "> Accessible Commands", value : `${ getAccessibleCommands() }`, inline : false
					},
					{
						name   : "> Language used",
						value  : `<:${ tsEmoji?.name }:${ tsEmoji?.id }> Typescript`,
						inline : false
					},
					{
						name   : "> Library used",
						value  : `<:${ discordEmoji?.name }:${ discordEmoji?.id }> Discord.js`,
						inline : false
					},
					{
						name   : "> Bot Owner",
						value  : `${ owner?.username }#${ owner?.discriminator } (id: ${ owner?.id }`,
						inline : false
					},
					{ name : "> Contributors", value : `ItsMrSammeh#0001 (id: 172033311592415232)`, inline : false },
					{
						name   : "> Source Code",
						value  : `[Click to reveal](https://github.com/V3dantSh4rma/Vibey-discord-bot)`,
						inline : false
					}
				);

			await interaction.reply({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.reply({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
