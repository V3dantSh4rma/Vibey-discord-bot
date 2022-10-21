require("dotenv").config();
import { Vibey } from "./handlers";

const bot : Vibey = new Vibey();

bot.startClient().catch(error => console.error(error));
bot.startServer().catch(error => console.error(error));