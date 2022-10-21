import { Command, CommandCategories, Vibey } from "../../handlers";
import { SlashCommandBuilder }               from "@discordjs/builders";
import { CacheType, CommandInteraction }     from "discord.js";
//import { QueueHandler }                      from "../../handlers/queueHandler";

export default class Skip extends Command {
	public category : CommandCategories = "MUSIC";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("skip")
			.setDescription("Skip the Current Playing Audio.");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		//const serverQueue = QueueHandler.checkIfQueueExists(interaction.guildId as unknown as number);

	}
}
