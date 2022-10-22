import { Command, CommandCategories, Vibey }             from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed }   from "discord.js";
import { CryptoManager }                                 from "../../lib/crypto/cryptoManager";
import CryptoInfo                                        from "../../lib/crypto/cryptoInfo";

const json = require("../../data/index.json");

export default class Crypto extends Command {
	public category : CommandCategories = "GENERAL";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("crypto")
			.setDescription("Get information on a cryptocurrency.")
			.addStringOption(( option : SlashCommandStringOption ) =>
				option
					.setName("cryptocurrency")
					.setDescription("The Crypto Currency you want to get info of.")
					.setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		const crypto : ( string | null ) = interaction.options.getString("cryptocurrency");
		await interaction.deferReply();

		try {
			const embed : MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setTimestamp();

			if ( !crypto ) {
				await CryptoManager.getLeaderboard();

				embed
					.setTitle("Top 5 Cryptocurrencies")
					.setDescription(`\`\`\`- ${ CryptoInfo.cryptoLeaderboard.join("\n- ") }\`\`\``);

				await interaction.followUp({ embeds : [ embed ] });
			}

			await CryptoManager.getCryptoInfo(crypto as string);

			embed
				.addFields(
					{ name : "-> Cryptocurrency", value : `${ CryptoInfo.Crypto }`, inline : false },
					{ name : "-> Symbol", value : `${ CryptoInfo.Symbol }`, inline : false },
					{ name : "-> Price in US Dollars", value : `$${ CryptoInfo.USD }`, inline : false },
					{ name : "-> Price in Euros", value : `€${ CryptoInfo.Euros }`, inline : false },
					{ name : "-> Price in Great British Pounds", value : `£${ CryptoInfo.GBP }`, inline : false }
				)
				.setImage(CryptoInfo.image as string);

			await interaction.followUp({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.followUp({
				content   : "Invalid Cryptocurrency.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
		}
	}
}
