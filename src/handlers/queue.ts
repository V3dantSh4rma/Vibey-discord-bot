import { Vibey }      from "./client";
import queueInterface from "../interfaces/queue";

const queue : Map<string, queueInterface> = Vibey.queue;

export class queueHandler {
	static checkIfQueueExists( serverID : number ) : boolean{
		return !!queue.get(String(serverID)) || false;
	}

	static getQueue( serverID : number ) : ( queueInterface | null ){
		return queue.get(String(serverID)) || null;
	}

	static createQueue( serverID : number ) : void{
		queue.set(String(serverID), {
			serverID : serverID
		});
		return;
	}

	static getSongs( serverID : number ) : String[] | null{
		return queue.get(String(serverID)).songs;
	}

	static deleteQueue( serverID : number ) : void{
		const existence = this.checkIfQueueExists(serverID);
		if ( !existence ) return;

		queue.delete(String(serverID));
		return;
	}
}
