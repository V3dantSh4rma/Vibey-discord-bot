import express from "express";
import path    from "path";

export class ExpressApplication {
	#app? : express.Express;
	#port : number = 7000;

	constructor( app : express.Express ){
		this.#app = app;
	}

	public async startServer() : Promise<void>{
		this.#app.listen(this.#port, async () => {
			console.log(`- Started the Server. You can view it at - http://localhost:${ this.#port }/`);
		});
		await this.handleRoutes();
	}

	private async handleRoutes(){

		this.#app.use("/static", express.static(path.join(__dirname, "..", "static")));

		this.#app.get("/", async ( request : express.Request, response : express.Response ) => {
			return response.sendFile(path.join(__dirname, "..", "static", "views", "index.html"));
		});
	}
}
