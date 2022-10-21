import { SlashCommandBuilder }               from "@discordjs/builders";
import { CacheType, CommandInteraction }     from "discord.js";
import { Command, CommandCategories, Vibey } from "../../handlers/";

export default class Cointoss extends Command {
	public category? : CommandCategories = "GAMING";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("cointoss") // /cointoss
			.setDescription("Toss a coin?");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {
			const cointoss : string[]  = [ "Heads", "Tails" ];
			const possibility : string = cointoss[ Math.floor(Math.random() * cointoss.length) ];
			await interaction.deferReply();
			await interaction.editReply("Tossing a coin...");
			setTimeout(async () => {
				await interaction.editReply(`${ possibility }`);
			}, 3000);
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
