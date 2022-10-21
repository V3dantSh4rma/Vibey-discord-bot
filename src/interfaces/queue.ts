import { AudioResource } from "@discordjs/voice";

export default interface queueInterface {
	serverID : number;
	nowPlaying? : string;
	isPaused? : boolean;
	isPlaying? : boolean;
	resource? : AudioResource;
	songs? : ( Array<string> | null );
}
