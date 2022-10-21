import { Command, CommandCategories, Vibey }             from "../../handlers";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, CommandInteraction }                 from "discord.js";

export default class RPS extends Command {
	public category : CommandCategories = "GAMING";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("rps")
			.setDescription("Rock Paper Scissors!")
			.addStringOption(( selection : SlashCommandStringOption ) =>
				selection
					.setName("selection")
					.setRequired(true)
					.setDescription("What do you choose? Rock, Paper or Scissors?")
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{

		try {
			await interaction.deferReply();
			const input : string             = interaction.options.getString("selection");
			const possibleChoices : string[] = [ "Rock", "Paper", "Scissors" ];
			const randomRPS : string         = possibleChoices[ Math.floor(Math.random() * possibleChoices.length) ];

			//Handling the Ties.
			if ( input.toLowerCase() == "rock" && randomRPS.toLowerCase() == "rock" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. It's a tie.`);
				return;
			}

			if ( input.toLowerCase() == "paper" && randomRPS.toLowerCase() == "paper" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. It's a tie.`);
				return;
			}

			if ( input.toLowerCase() == "scissors" && randomRPS.toLowerCase() == "scissors" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. It's a tie.`);
				return;
			}

			//Handling the Wins.
			if ( input.toLowerCase() == "rock" && randomRPS.toLowerCase() == "scissors" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. Congrats! You won.`);
				return;
			}

			if ( input.toLowerCase() == "paper" && randomRPS.toLowerCase() == "rock" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. Congrats! You won.`);
				return;
			}

			if ( input.toLocaleLowerCase() == "scissors" && randomRPS.toLowerCase() == "paper" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. Congrats! You won.`);
				return;
			}

			//Handling the Client Wins.
			if ( randomRPS.toLowerCase() == "rock" && input.toLowerCase() == "scissors" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. I won. Better Luck Next time!`);
				return;
			}

			if ( randomRPS.toLowerCase() == "paper" && input.toLowerCase() == "rock" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. I won. Better Luck Next time!`);
				return;
			}

			if ( randomRPS.toLowerCase() == "scissors" && input.toLowerCase() == "paper" ) {
				await interaction.followUp(`You choose ${ input }. I choose ${ randomRPS }. I won. Better Luck Next time!`);
				return;
			}

			return await interaction.followUp("Invalid Selection. Make sure to type in ``Rock``, ``Paper`` or ``Scissors`` to play.");
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
