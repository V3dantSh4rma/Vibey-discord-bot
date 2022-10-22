import { Command, CommandCategories, Vibey }                          from "../handlers";
import { SlashCommandBuilder }                                        from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageButton, MessageEmbed } from "discord.js";
import paginate                                                       from "../lib/pagination";

const json = require("../data/index.json");

export default class Help extends Command {
	public category : CommandCategories = "GENERAL";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("help")
			.setDescription("Get the Usable commands by the bot.");
	};

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		try {

			const commandData : any = {
				FUN : {
					commands : []
				},

				GENERAL : {
					commands : []
				},

				IMAGE : {
					commands : []
				},

				API : {
					commands : []
				},

				GAMING : {
					commands : []
				},

				MUSIC : {
					commands : []
				},

				INFORMATION : {
					commands : []
				},

				MODERATION : {
					commands : []
				},

				NSFW : {
					commands : []
				}
			};

			client.commands.forEach(( cmd : Command ) => {
				commandData[ cmd.category as any ]?.commands.push(cmd.builderJson.name);
			});

			const apiCommands : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 1\`\`\`\nCommands Available - ${ commandData.API.commands.length }`)
				.addField("> :smile: Api Commands", `\`\`\`- /${ commandData.API.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const funCommands : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 2\`\`\`\nCommands Available - ${ commandData.FUN.commands.length }`)
				.addField("> :laughing: Fun Commands", `\`\`\`- /${ commandData.FUN.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const gameCommands : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 3\`\`\`\nCommands Available - ${ commandData.GAMING.commands.length }`)
				.addField("> :controller: Game Related Commands", `\`\`\`- /${ commandData.GAMING.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const imageCommands : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 4\`\`\`\nCommands Available - ${ commandData.IMAGE.commands.length }`)
				.addField("> :camera: Image Manipulation Commands", `\`\`\`- /${ commandData.IMAGE.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const generalCommands : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 5\`\`\`\nCommands Available - ${ commandData.GENERAL.commands.length }`)
				.addField("> :sweat_smile: General Commands", `\`\`\`- /${ commandData.GENERAL.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const information : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 6\`\`\`\nCommands Available - ${ commandData.INFORMATION.commands.length }`)
				.addField("> :open_mouth: Information Commands", `\`\`\`- /${ commandData.INFORMATION.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const moderation : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 7\`\`\`\nCommands Available - ${ commandData.MODERATION.commands.length }`)
				.addField("> :open_mouth: Information Commands", `\`\`\`- /${ commandData.MODERATION.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const nsfw : MessageEmbed = new MessageEmbed()
				.setTitle(`${ client?.user?.username }'s Commands`)
				.setDescription(`\`\`\`Page: 8\`\`\`\nCommands Available - ${ commandData.NSFW.commands.length }`)
				.addField("> :underage: NSFW Commands", `\`\`\`- /${ commandData.NSFW.commands.join("\n- /") }\`\`\``)
				.setColor("RANDOM")
				.setTimestamp();

			const button1 : MessageButton = new MessageButton()
				.setEmoji("⏮️")
				.setStyle("PRIMARY")
				.setCustomId("btn-1");


			const button2 : MessageButton = new MessageButton()
				.setEmoji("⏭️")
				.setStyle("PRIMARY")
				.setCustomId("btn-2");

			await paginate(interaction, [ apiCommands, funCommands, gameCommands, imageCommands, generalCommands, information, moderation, nsfw ], [ button1, button2 ]);
		} catch ( e ) {
			await interaction.reply({
				content   : json.error_msg,
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
};
