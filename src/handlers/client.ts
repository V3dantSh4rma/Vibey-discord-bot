import { CacheType, Client, Collection, GuildMember, Intents, Interaction } from "discord.js";
import * as path                                                            from "path";
import { FileLoader }                                                       from "../utility/file-loader";
import { Command }                                                          from "./command";
import { REST }                                                             from "@discordjs/rest";
import { Routes }                                                           from "discord-api-types/v9";
import { ExpressApplication }                                               from "../server";
import express                                                              from "express";
import queueInterface                                                       from "../interfaces/queue";

const intents : Intents = new Intents(32767);

export class Vibey extends Client {
	static queue : Map<string, queueInterface> = new Map();
	commands : Collection<string, Command>;
	_rest : REST                               = new REST({ version : "9" }).setToken(process.env.TOKEN as string);
	private app? : express.Express;

	constructor(){
		super({ intents });
		this.commands = new Collection<string, Command>();
	}

	public async startClient() : Promise<void>{
		await this.login(process.env.TOKEN as string);
		await this.user.setStatus("invisible");
		await this.user.setPresence({
			status : "dnd", activities : [
				{ type : "WATCHING", name : "You <3" }
			]
		});
		await this.loadCommandHandlers();
		await this.addCommandsToServer();
		await this.registerEventListeners();
		console.log("Bot is online.");
		console.log(`Serving ${ this.users.cache.size } users.`);
		console.log(`Serving in ${ this.guilds.cache.size } servers.`);
	}

	public async startServer() : Promise<void>{
		this.app                                  = express();
		const serverInstance : ExpressApplication = new ExpressApplication(this.app);
		await serverInstance.startServer();
	}

	private async addCommandsToServer(){

		const commandsArray : any[] = [];
		for ( let command of this.commands.values() ) {
			commandsArray.push(command.builderJson);
		}

		await this._rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID as string),
			{ body : commandsArray }
		);


		console.log(`Registered the Slash Commands (${ commandsArray.map(c => "/" + c.name).join(", ") }).`);
	}

	private async loadCommandHandlers(){
		const modules = await FileLoader.importModulesFrom<Command>(path.join(__dirname, "..", "commands", "**", "*{.js,.ts}"));

		for ( let commandModule of modules ) {
			const command            = new commandModule.instance();
			const commandBuilderJson = command.builderJson;

			this.commands.set(commandBuilderJson.name, command);
		}
	}

	private async registerEventListeners(){

		this.on("interactionCreate", async ( interaction : Interaction<CacheType> ) => {
			if ( interaction.isCommand() ) {
				try {
					const command : Command             = this.commands.get(interaction.commandName);
					const interactionUser : GuildMember = interaction.guild.members.cache.get(interaction.user.id);

					if ( interaction.user.bot ) return;

					if ( command?.dev === true ) {
						if ( interactionUser.id === "554301512227094528" ) {
							return command?.handle(interaction, this);
						}

						return await interaction.reply({
							content   : "This command is Developer only.",
							ephemeral : true
						});
					}

					if ( command.modOnly ) {
						if ( interaction.memberPermissions.has("KICK_MEMBERS" || "KICK_MEMBERS" || "ADMINISTRATOR") ) {
							return await command.handle(interaction, this);
						}

						return await interaction.reply({
							content   : "This command is Moderators Only.",
							ephemeral : true
						});
					}

					if ( command.usersHaveAccess ) {
						command.usersHaveAccess.forEach(( user : Number ) => {
							if ( String(user) === interaction.user.id ) {
								return command.handle(interaction, this);
							}

							return interaction.reply("You do not have access to this command.");
						});
					}

					await command?.handle(interaction, this);
				} catch ( e ) {
					await interaction.reply({
						content   : "There was an error in executing that Command.",
						ephemeral : true
					});
					console.error(e);
					return;
				}
			}
		});
	}
}
