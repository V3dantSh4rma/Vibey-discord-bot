export default class CryptoInfo {
	static Crypto? : string;
	static Symbol? : string;
	static USD? : string;
	static Euros? : string;
	static GBP? : string;
	static image? : string;
	static cryptoLeaderboard? : any;

	public static createPost( post : any ){
		this.Crypto = post.name;
		this.Symbol = post.symbol;
		this.USD    = post.market_data.current_price.usd;
		this.Euros  = post.market_data.current_price.eur;
		this.GBP    = post.market_data.current_price.gbp;
		this.image  = post.image.large;
	}
}
