import { Vibey }               from "./client";
import { CommandInteraction }  from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export type CommandCategories =
	"API"
	| "FUN"
	| "IMAGE"
	| "GENERAL"
	| "INFORMATION"
	| "MUSIC"
	| "MODERATION"
	| "DEVELOPER"
	| "GAMING"
	| "ASTRONOMY";

export abstract class Command {

	public category? : CommandCategories;
	public dev? : boolean;
	public nsfw? : boolean;
	public modOnly? : boolean;
	public usersHaveAccess? : Number[];

	get builderJson(){
		return this.builder().toJSON();
	}

	abstract builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

	abstract handle( interaction : CommandInteraction, client : Vibey ) : Promise<any>
}
