import { Command, CommandCategories, Vibey }           from "../../handlers/";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, CommandInteraction, User }         from "discord.js";

const json = require("../../data/index.json");

export default class Gayrate extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("gayrate")
			.setDescription("Get to know how gay you are.")
			.addUserOption(( u : SlashCommandUserOption ) =>
				u.setName("user")
				 .setDescription("The user you want to use this command on.")
				 .setRequired(false)
			);
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ){
		const user : User        = interaction.options.getUser("user");
		const randomNum : string = Math.floor(Math.random() * 100).toString();

		if ( !user ) {
			await interaction.reply(`**You** are **${ randomNum }%** gay. :rainbow: :rainbow_flag:`);
			return;
		}

		await interaction.reply(`<@!${ user.id }> is **${ randomNum }%** gay. :rainbow: :rainbow_flag:`);
		return;
	}
}
