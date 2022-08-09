import { requestsListeners, rootUrls } from './AHF';
import { Request, RequestListener, Response } from './lib';

class Router {
	private readonly children: boolean;
	private readonly rootUrl: string;

	constructor(url: string = '/', children: boolean = true) {
		if (children) {
			rootUrls.push(url);
		}
		this.rootUrl = rootUrls[0] + url;
		this.children = children;
		console.log(`ROUTER: ${url}; CHILDREN: ${children}`);
	}

	private addRequest({ url, method, callback, middlewares }: RequestListener) {
		url = url.endsWith('/') ? url : url + '/';
		requestsListeners.push({
			url: (this.children ? rootUrls.join('') : this.rootUrl) + url,
			method,
			callback,
			middlewares
		});
		console.log(`METHOD: ${method}; URL: ${url}; MIDDLEWARES: ${middlewares.length};`);
	}

	public get(url: string, callback: (req: Request, res: Response) => void, ...middlewares: Array<(req: Request, res: Response) => void>) {
		this.addRequest({ url, callback, middlewares, method: 'GET' });
	}
}

export default Router;