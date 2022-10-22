import fs   from "fs";
import path from "path";

export default function updateUses(){
	const pathToFile : string = path.join(__dirname, "..", "data", "index.json");
	const file                = fs.readFileSync(pathToFile);
	// To Be Done: Read, Edit, Write.
};
