import { CacheType, CommandInteraction }     from "discord.js";
import { Command, CommandCategories, Vibey } from "../../handlers/";
import { SlashCommandBuilder }               from "@discordjs/builders";

export default class Ping extends Command {

	public category : CommandCategories = "GENERAL";

	builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Pong!");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.reply(`Pong! ${ client.ws.ping }ms.`);
	}

}
