import axios, { AxiosResponse } from "axios";
import CryptoInfo               from "./cryptoInfo";

export class CryptoManager {

	static async get( crypto : string ) : Promise<CryptoInfo | null>{

		try {
			const resID : AxiosResponse<any> = await axios.get<any>(`https://api.coingecko.com/api/v3/search?query=${ crypto.replace(/\s/g, "+") }`);
			const data : AxiosResponse<any>  = await axios.get<any>(`https://api.coingecko.com/api/v3/coins/${ resID.data.coins[ 0 ].id }`);
			return data.data;
		} catch ( e ) {
			return null;
		}

	};

	public static async getCryptoInfo( crypto : string ) : Promise<void>{
		const data = await this.get(crypto);

		return CryptoInfo.createPost(data);
	};

	public static async getLeaderboard() : Promise<any>{
		try {

			const btc : Array<string>      = [];
			const res : AxiosResponse<any> = await axios.get<string>("https://api.coingecko.com/api/v3/coins");

			for ( let i : number = 0; i < 5; i++ ) {
				btc.push(res.data[ i ].name as string);
			}

			return ( CryptoInfo.cryptoLeaderboard = btc );
		} catch ( e ) {
			return;
		}
	}
}
