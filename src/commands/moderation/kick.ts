import { Command, CommandCategories, Vibey }                                     from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, GuildMember, MessageEmbed }              from "discord.js";

export default class Kick extends Command {
	public category : CommandCategories = "MODERATION";
	public modOnly : boolean            = true;

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("kick")
			.setDescription("Kick a member out of your server.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to kick.")
					.setRequired(true)
			)
			.addStringOption(( string : SlashCommandStringOption ) =>
				string
					.setName("reason")
					.setDescription("The reason to kick the member.")
					.setRequired(false)
			);
	};

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const userToKick : ( GuildMember | undefined ) = interaction!.guild!.members.cache.get(interaction!.options!.getUser("user") as any);
		const author : any                             = interaction.member;
		let reason : string                            = interaction.options.getString("reason") ? `${ interaction.options.getString("reason") } \n Member kicked by ${ interaction.user.username }#${ interaction.user.discriminator } (id: ${ interaction.user.id }) ` : `No reason specified.\n Member kicked by ${ interaction.user.username }#${ interaction.user.discriminator } (id: ${ interaction.user.id })`;

		if ( !interaction!.guild!.me!.permissions.has("KICK_MEMBERS") ) {
			return await interaction.reply({
				content   : "I require \"KICK_MEMBERS\" Permission to use this command.",
				ephemeral : true
			});
		}

		if ( !author.permissions.has("KICK_MEMBERS") ) {
			return await interaction.reply({
				content   : "You require \"KICK_MEMBERS\" Permission to use this command.",
				ephemeral : true
			});
		}

		try {
			userToKick?.kick(`${ reason }`).then(async () => {
				const embed : MessageEmbed = new MessageEmbed()
					.setColor("RANDOM")
					.setTimestamp()
					.setThumbnail("https://cdn.discordapp.com/emojis/912556056247435334.gif?size=96&quality=lossless")
					.setTitle(`Successfully Kicked the user from the server.`)
					.addFields(
						{
							name   : "> Member Banned:",
							value  : `${ userToKick?.user.tag } (id: ${ author?.id } )`,
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
					);

				await interaction.reply({
					embeds : [ embed ]
				});
			});
		} catch ( e : any ) {
			await interaction.reply({
				content   : "There was an error in executing the command. Make sure to go to this server roles setting and put my role on the top of everyone.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
