import { Command, CommandCategories, Vibey }           from "../../handlers";
import { SlashCommandBuilder }                         from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import axios, { AxiosResponse }                        from "axios";

export default class FakeIdentity extends Command {
	public category : CommandCategories = "FUN";

	public builder() : Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">{
		return new SlashCommandBuilder()
			.setName("fake_identity")
			.setDescription("Receive a fake identity");
	}

	async handle( interaction : CommandInteraction<CacheType>, client : Vibey ) : Promise<any>{
		await interaction.deferReply();

		try {
			const response : AxiosResponse<any> = await axios.get<string>(process.env.FAKE_IDENTITY_API as string);
			const {
					  name,
					  address,
					  maiden_name,
					  birth_data,
					  email_u,
					  email_d,
					  username,
					  password,
					  domain,
					  useragent,
					  ipv4,
					  macaddress,
					  plasticcard,
					  cardexpir,
					  height,
					  weight,
					  blood,
					  eye,
					  sport
				  }                             = response.data;

			const embed : MessageEmbed = new MessageEmbed()
				.setTitle("Successfully generated a fake identity.")
				.addFields(
					{
						name   : "> 🤠 Basic Information",
						value  : `\`\`\`- Name: ${ name }\n- Address: ${ address }\n- Maiden Name: ${ maiden_name }\n- Birth Date: ${ birth_data }\`\`\``,
						inline : false
					},
					{
						name   : "> 💳 Credit Card Information",
						value  : `\`\`\`- Card Number: ${ plasticcard }\n- Card Expiry: ${ cardexpir }\`\`\``,
						inline : false
					},
					{
						name   : "> 💻 Internet Information",
						value  : `\`\`\`- Email Address: ${ email_u }@${ email_d }\n- Username: ${ username }\n- Password: ${ password }\n- IpV4 Address: ${ ipv4 }\n- Mac Address: ${ macaddress }\n- Domain: ${ domain }\n- User agent: ${ useragent }\`\`\``,
						inline : false
					},
					{
						name   : "> 🙂 Face Complexion",
						value  : `\`\`\`- Eye Colour - ${ eye }\n- Blood Group: ${ blood }\n- Height: ${ height }cm\n- Weight: ${ weight }kg\n- Favourite Sport: ${ sport }\`\`\``,
						inline : false
					}
				);

			await interaction.followUp({ embeds : [ embed ] });
		} catch ( e ) {
			await interaction.followUp({
				content   : "There was an error in executing the command. I have told the developers about it.",
				ephemeral : true
			});
			console.error(`- Error at command ${ this.builderJson.name }.\n\t\t${ e }`);
			return;
		}
	}
}
