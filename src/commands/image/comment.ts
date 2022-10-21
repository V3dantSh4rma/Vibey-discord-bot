import { Canvacord }                                              from "canvacord";
import { Command, CommandCategories, Vibey }                      from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption }          from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageAttachment, User } from "discord.js";

export default class Comment extends Command {
	public category : CommandCategories = "IMAGE";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup" | any>{
		return new SlashCommandBuilder()
			.setName("comment")
			.setDescription("Generate a PornHub themed comment.")
			.addStringOption(( s : SlashCommandStringOption ) =>
				s
					.setName("text")
					.setDescription("The text you want to comment.")
					.setRequired(true)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{

		try {
			const user : ( User | null ) = interaction.options.getUser("user") ?? interaction.user;

			if ( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
				await interaction.reply("I require \"ATTACH_FILES\" permission to use this command.");
				return;
			}

			const comment : Buffer = await Canvacord.phub({
				username : `${ user.username }`,
				message  : `${ interaction.options.getString("text") }`,
				image    : `${ user.avatarURL({ format : "png" }) }`
			});

			const attachment : MessageAttachment = new MessageAttachment(comment, "comment.jpeg");
			await interaction.reply({
				files : [ attachment ]
			});
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
