/**
 * This part of code is not coded by me. I have just yolo'ed it into typescript compatible.
 * Credits and a huge thanks goes to https://github.com/ryzyx/
 * View the script at - https://github.com/ryzyx/discordjs-button-pagination/blob/interaction/index.js
 */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export default async function paginate(
	interaction : any,
	pages : MessageEmbed[],
	buttonList : MessageButton[],
	timeout : number = 120000 ){
	let page  = 0;
	const row = new MessageActionRow().addComponents(buttonList);

	if ( interaction.deferred == false ) {
		await interaction.deferReply();
	}

	const curPage = await interaction.editReply({
		embeds     : [ pages[ page ].setFooter({ text : `Page ${ page + 1 } / ${ pages.length }` }) ],
		components : [ row ],
		fetchReply : true,
	});

	const filter = ( i : any ) =>
		i.customId === buttonList[ 0 ].customId ||
		i.customId === buttonList[ 1 ].customId;

	const collector = await curPage.createMessageComponentCollector({
		filter,
		time : timeout,
	});

	collector.on("collect", async ( i : { customId : any; deferUpdate : () => any; editReply : ( arg0 : { embeds : MessageEmbed[]; components : MessageActionRow[]; } ) => any; } ) => {
		switch ( i.customId ) {
			case buttonList[ 0 ].customId:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case buttonList[ 1 ].customId:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		await i.deferUpdate();
		await i.editReply({
			embeds     : [ pages[ page ].setFooter({ text : `Page ${ page + 1 } / ${ pages.length }` }) ],
			components : [ row ],
		});
		collector.resetTimer();
	});

	collector.on("end", ( _ : any, reason : any ) => {
		if ( reason !== "messageDelete" ) {
			const disabledRow = new MessageActionRow().addComponents(
				buttonList[ 0 ].setDisabled(true),
				buttonList[ 1 ].setDisabled(true)
			);
			curPage.edit({
				embeds     : [ pages[ page ].setFooter({ text : `Page ${ page + 1 } / ${ pages.length }` }) ],
				components : [ disabledRow ],
			});
		}
	});

	return curPage;
}
