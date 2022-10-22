import { Command, CommandCategories, Vibey }             from "../../handlers/";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed }   from "discord.js";
import { Crypter }                                       from "../../lib/encryption-decryption/crypter";

const json = require("../../data/index.json");

export default class Encrypt extends Command {
	public category : CommandCategories = "INFORMATION";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("encrypt")
			.setDescription("Encrypt your messages")
			.addStringOption(( cmd : SlashCommandStringOption ) =>
				cmd
					.setName("text")
					.setDescription("The text you want to encrypt.")
					.setRequired(true)
			);
	};

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const text : string       = interaction.options.getString("text");
		const encrypted : Crypter = Crypter.encrypt("salt", text);

		try {
			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Encryption Successful!")
				.addFields(
					{ name : "> Text", value : `${ text }`, inline : false },
					{ name : "> Encrypted Text", value : `${ encrypted }`, inline : false }
				);

			await interaction.reply({
				embeds : [ embed ]
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
