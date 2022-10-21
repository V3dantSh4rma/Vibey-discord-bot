/*
 * Credits:
 * ActionHero - https://github.com/actionhero/actionhero/blob/master/src/classes/process/typescript.ts
 * Sam - https://github.com/iDevelopThings
 */

import path               from "path";
import { glob, IOptions } from "glob";

export interface FormatPathInformation {
	forTsNode : string;
	forNode : string;
}

export interface ImportedModule<T> {
	instance : new ( ...args : any[] ) => T;
	name : any;
	originalPath : string;
	forRunEnvironment : string;
}

export class FileLoader {

	static isTypescript() : boolean{

		const extension = path.extname(__filename);
		if ( extension === ".ts" ) {
			return true;
		}

		if ( process.env.NODE_ENV === "test" && process.env.JEST_WORKER_ID ) {
			return true;
		}

		const lastArg = process.execArgv[ process.execArgv.length - 1 ];
		if ( lastArg && path.parse(lastArg).name.indexOf("ts-node") >= 0 ) {
			return true;
		}

		try {
			//@ts-ignore
			const isTsNode = process[ Symbol.for("ts-node.register.instance") ];

			return isTsNode?.ts !== undefined;
		} catch ( error ) {
			console.error(error);
			return false;
		}
	}

	/**
	 * @param path
	 * @param {IOptions} options
	 */
	static filesInPath( path : string, options : IOptions = { follow : true } ){
		return glob.sync(path, options);
	}

	/**
	 * @param pathToNormalize
	 */
	static normalizePath( pathToNormalize : string ){
		return path.isAbsolute(pathToNormalize)
			   ? path.normalize(pathToNormalize)
			   : path.join(process.cwd(), pathToNormalize);
	}

	/**
	 * @param pathToFormat
	 * @param extensions
	 */
	static formatPathForRunEnvironment(
		pathToFormat : string,
		extensions : FormatPathInformation = { forTsNode : "ts", forNode : "js" }
	){
		const isTS            = this.isTypescript();
		pathToFormat          = this.normalizePath(pathToFormat);
		const pathInformation = path.parse(pathToFormat);

		pathInformation.ext = isTS ? extensions.forTsNode : extensions.forNode;

		if ( !isTS )
			pathInformation.base = pathInformation.base.replace(
				`${ pathInformation.name }.${ extensions.forTsNode }`,
				`${ pathInformation.name }.${ extensions.forNode }`,
			);

		if ( !isTS && ( pathInformation.dir.includes("/src/") || pathInformation.dir.includes("\\src\\") ) ) {
			pathInformation.dir = pathInformation.dir.replace("/src/", "/dist/")
												 .replace("\\src\\", "\\dist\\");
		}

		return path.format(pathInformation);
	}

	/**
	 * @param path
	 */
	static async importModulesFrom<T>( path : string ) : Promise<ImportedModule<T>[]>{
		const files   = this.filesInPath(path);
		const modules = [];

		for ( let path of files ) {
			const pathForEnv = this.formatPathForRunEnvironment(path);
			try {
				const module = await import(pathForEnv);

				for ( const key in module ) {
					const instance = module[ key ];
					const name     = instance.name;

					modules.push({
						instance          : instance,
						name              : name,
						originalPath      : path,
						forRunEnvironment : pathForEnv,
					});
				}
			} catch ( error ) {
				console.error(error);
			}
		}

		return modules;
	}
}
