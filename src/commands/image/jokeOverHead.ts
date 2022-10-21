import { Command, CommandCategories, Vibey }                from "../../handlers/";
import { SlashCommandBuilder, SlashCommandUserOption }      from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageAttachment } from "discord.js";
import { Canvacord }                                        from "canvacord";
import Buffer                                               from "buffer";

export default class JokeOverHead extends Command {
	public category : CommandCategories = "IMAGE";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("jokeoverhead")
			.setDescription("Generate a Joke Over Head Meme.")
			.addUserOption(( user : SlashCommandUserOption ) =>
				user
					.setName("user")
					.setDescription("The user you want to use this on.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const user : ( SlashCommandUserOption | any ) = interaction.options.get("user")?.user ?? interaction.user;

		try {
			if ( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
				await interaction.channel?.send("I do not have permissions to attach files.");
				return;
			}

			const img : Buffer = await Canvacord.jokeOverHead(`${ user.avatarURL({ format : "png" }) }`);

			const attachment : MessageAttachment = new MessageAttachment(img, "jokeOverHead.png");

			await interaction.reply({ files : [ attachment ] });
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
