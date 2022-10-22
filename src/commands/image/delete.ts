import { Command, CommandCategories, Vibey }                      from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption }            from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageAttachment, User } from "discord.js";
import { Canvacord }                                              from "canvacord";

const json = require("../../data/index.json");

export default class Delete extends Command {
	public category : CommandCategories = "IMAGE";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("delete")
			.setDescription("Generate a delete meme.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to use this command at.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user : ( User | null ) = interaction.options.getUser("user") ?? interaction.user;

		if ( !interaction!.guild!.me!.permissions.has("ATTACH_FILES") ) {
			return await interaction.reply("I require \"ATTACH_FILES\" Permissions to use this command.");
		}

		try {
			const deleteBuffer : Buffer          = await Canvacord.delete(user.avatarURL({ format : "png" }) as string, true);
			const attachment : MessageAttachment = new MessageAttachment(deleteBuffer, "delete.jpeg");

			await interaction.reply({
				files : [ attachment ]
			});
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
