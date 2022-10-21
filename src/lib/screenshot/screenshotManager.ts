import puppeteer, { Browser, Page } from "puppeteer";
import * as fs                      from "fs";
import path                         from "path";
import ErrnoException = NodeJS.ErrnoException;

export default class ScreenshotManager {
	public async fetchScreenshot( url : string ) : Promise<boolean>{
		await this.cleanUp();
		try {
			const browser : Browser = await puppeteer.launch();
			const page : Page       = await browser.newPage();

			await page.setViewport({
				width  : 1200,
				height : 1200
			});

			await page.goto(url);

			setTimeout(async () => {
				await page.screenshot({
					path           : "C:/Users/stanp/Desktop/Projects/Discord Bots And Libraries/Vibey/src/screenshot.png",
					omitBackground : true
				});
				await browser.close();
			}, 5000);
			return true;
		} catch ( e ) {
			return false;
		}
	}

	private async cleanUp() : Promise<void>{
		const pathToFile : string = path.join(__dirname, "..", "..", "screenshot.png");

		if ( fs.existsSync(pathToFile) ) {
			fs.rm(pathToFile, ( error : ErrnoException | null ) => {
				if ( error ) console.error(error);
			});
			return;
		}
	}
}
