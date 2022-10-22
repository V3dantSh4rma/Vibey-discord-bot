import { Command, CommandCategories, Vibey }             from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, CommandInteraction }                 from "discord.js";

const json = require("../../data/index.json");

export default class JavascriptParser extends Command {
	public category : CommandCategories = "GENERAL";

	public dev : boolean = true;

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("js")
			.setDescription("Execute a javascript code.")
			.addStringOption(( a : SlashCommandStringOption ) =>
				a
					.setName("code")
					.setDescription("The javascript code you want to execute.")
					.setRequired(true)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {
			eval(interaction.options.getString("code") as string);
		} catch ( e ) {
			await interaction.reply({ content : json.error_msg, ephemeral : true });
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
