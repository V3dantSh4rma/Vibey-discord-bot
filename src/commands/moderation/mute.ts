import { Command, CommandCategories, Vibey }                                                        from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption }                    from "@discordjs/builders";
import { CacheType, CommandInteraction, Guild, GuildBasedChannel, GuildMember, MessageEmbed, Role } from "discord.js";

export default class Mute extends Command {
	public category : CommandCategories = "MODERATION";
	public modOnly : boolean            = true;

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("mute")
			.setDescription("Mute a member from your server.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user.setName("user")
					.setDescription("The user you want to kick.")
					.setRequired(true)
			)
			.addStringOption(( string : SlashCommandStringOption ) =>
				string.setName("reason")
					  .setDescription("The reason of this mute.")
					  .setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ){
		await interaction.deferReply();

		try {
			const user : GuildMember = interaction.guild.members.cache.get(`${ interaction.options.getUser("user").id }`);
			const reason : string    = interaction.options.getString("reason") || "No reason specified.";
			const guild : Guild      = interaction.guild;
			let muteRole : any       = guild.roles.cache.filter(( role : Role ) => role.name == ( "muted" || "Muted" ));
			//const channel            = interaction.guild.channels.cache.get(interaction.id);

			if ( !interaction.guild.me.permissions.has("MANAGE_ROLES" || "MANAGE_CHANNELS") ) {
				await interaction.followUp("I require ``MANAGE ROLES`` and ``MANAGE CHANNELS`` permissions to use this command.");
			}

			if ( !muteRole ) {
				muteRole = await guild.roles.create({
					name  : "Muted",
					color : "DARK_BUT_NOT_BLACK"
				});
			}

			if ( user.roles.cache.has(muteRole.id) ) {
				await interaction.followUp("The User is already Muted.");
				return;
			}

			guild.channels.cache.forEach(( channel : GuildBasedChannel ) => {
				try {
					channel.edit({
						permissionOverwrites : [
							{
								id   : muteRole.id,
								deny : [ "SEND_MESSAGES" ]
							}
						]
					});
				} catch ( e ) {
					interaction.followUp("There was an error while executing the command.").catch(error => console.error(error));
					return;
				}
			});

			await user.roles.add(muteRole.id);

			const userPayloadEmbed : MessageEmbed = new MessageEmbed()
				.setTitle("You have been Muted")
				.setColor("RED")
				.addFields(
					{
						name   : "> Server",
						value  : `${ interaction.guild.name }`,
						inline : false
					},
					{
						name   : "> Moderator",
						value  : `${ interaction.user.username }#${ interaction.user.discriminator }`,
						inline : false
					},
					{
						name   : "> Reason",
						value  : reason,
						inline : false
					}
				)
				.setTimestamp();

			const dm = await user.createDM(true);
			if ( !dm ) {
				userPayloadEmbed.setDescription("User not notified since there DM is closed.");
			}

			await client.users.cache.get(user.id).send({
				embeds : [ userPayloadEmbed ]
			});

			await interaction.followUp({
				embeds : [ userPayloadEmbed.setTitle("User Muted Successfully") ]
			});
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
