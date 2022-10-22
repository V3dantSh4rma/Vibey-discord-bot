import { Command, CommandCategories, Vibey }                                     from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, GuildMember, MessageEmbed }              from "discord.js";

const json = require("../../data/index.json");

export default class Ban extends Command {
	public category : CommandCategories = "MODERATION";
	public modOnly : boolean            = true;

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("ban")
			.setDescription("Ban a user from your server.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to ban.")
					.setRequired(true)
			)
			.addStringOption(( reason : SlashCommandStringOption ) =>
				reason
					.setName("reason")
					.setDescription("Reason for the ban.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const userToBan : ( GuildMember | undefined ) = interaction?.guild?.members.cache.get(interaction.options.getUser("user")?.id as string);
		const author : ( GuildMember | undefined )    = interaction.guild?.members.cache.get(interaction.user.id as string);
		const reason : string                         = interaction.options.getString("reason") as string || `No reason specified.\nUser banned by- ${ interaction.user.username }`;

		try {
			if ( !author?.permissions.has("BAN_MEMBERS") ) {
				await interaction.reply({
					content   : "You require **'BAN MEMBERS'** permission to use this command.",
					ephemeral : true
				});
				return;
			}

			if ( !interaction?.guild?.me?.permissions.has("BAN_MEMBERS") ) {
				await interaction.reply("I require **'Ban Members'** permission to use this command.");
				return;
			}


			userToBan?.ban({
				reason : reason
			}).then(async () => {
				const embed : MessageEmbed = new MessageEmbed()
					.setColor("RANDOM")
					.setThumbnail("https://cdn.discordapp.com/emojis/912556056247435334.gif?size=96&quality=lossless")
					.setTitle(`Successfully banned the user from the server.`)
					.addFields(
						{
							name   : "> Member Banned:",
							value  : `${ userToBan?.user.tag } (id: ${ author?.id } )`,
							inline : false
						},
						{
							name   : "> Moderator",
							value  : `${ author?.user.tag } (id: ${ author?.id })`,
							inline : false
						},
						{
							name   : "> Reason",
							value  : `${ interaction.options.getString("reason") ?? "No reason specified." }`,
							inline : false
						}
					)
					.setTimestamp();

				await interaction.reply({
					embeds : [ embed ]
				});
			});

		} catch ( e ) {
			await interaction.reply({
				content   : "There was an error in executing the command. Make sure to go to this server roles setting and put my role on the top of everyone.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
