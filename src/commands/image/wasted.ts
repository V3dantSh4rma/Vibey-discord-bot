import { Canvacord }                                        from "canvacord";
import { Command, CommandCategories, Vibey }                from "../../handlers";
import { SlashCommandBuilder, SlashCommandUserOption }      from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageAttachment } from "discord.js";
import Buffer                                               from "buffer";

const json = require("../../data/index.json");

export default class Wasted extends Command {
	public category : CommandCategories = "IMAGE";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("wasted")
			.setDescription("Wasted...")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to use this command on")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user : ( SlashCommandUserOption | any ) = interaction.options.get("user")?.user ?? interaction.user;

		try {
			if ( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
				await interaction.channel?.send("I do not have permissions to attach files.");
			}

			const img : Buffer = await Canvacord.wasted(`${ user.avatarURL({ format : "png" }) }`);

			const attachment : MessageAttachment = new MessageAttachment(img, "wasted.png");

			await interaction.reply({ files : [ attachment ] });
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
