import { Command, CommandCategories, Vibey }                      from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption }            from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageAttachment, User } from "discord.js";
import { Canvacord }                                              from "canvacord";

const json = require("../../data/index.json");

export default class Trash extends Command {
	public category : CommandCategories = "IMAGE";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("trash")
			.setDescription("Create a trash meme on someone from this server or on yourself.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to use this command at.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{

		const user : ( User ) = interaction.options.getUser("user") ?? interaction.user;

		if ( !interaction!.guild!.me!.permissions.has("ATTACH_FILES") ) {
			return await interaction.reply("I require \"ATTACH_FILES\" Permissions to use this command.");
		}

		try {
			const trashBuffer : Buffer           = await Canvacord.trash(user.avatarURL({ format : "png" }) as string);
			const attachment : MessageAttachment = new MessageAttachment(trashBuffer, "trash.jpeg");

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
