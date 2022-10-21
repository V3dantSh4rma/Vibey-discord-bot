import { Command, CommandCategories, Vibey }             from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed }   from "discord.js";
import { Crypter }                                       from "../../lib/encryption-decryption/crypter";

export default class Decrypt extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("decrypt")
			.setDescription("Decrypt a message")
			.addStringOption(( string : SlashCommandStringOption ) =>
				string
					.setName("hash")
					.setDescription("The hash you want to decrypt.")
					.setRequired(true)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{

		try {
			const hash : string       = interaction.options.getString("hash");
			const decrypted : Crypter = Crypter.decrypt("salt", hash as string);

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle("Decryption Successful")
				.setColor("RANDOM")
				.addFields(
					{ name : "> Encrypted Text", value : hash as string, inline : false },
					{ name : "> Decrypted Text", value : decrypted as string, inline : false }
				);

			await interaction.reply({ embeds : [ embed ] });
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
