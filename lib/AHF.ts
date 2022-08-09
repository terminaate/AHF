import http, { IncomingMessage, Server, ServerResponse } from 'http';
import { Request, RequestListener, Response } from './lib';

export const requestsListeners: RequestListener[] = [];
export const rootUrls: string[] = [];

class AHF {
	private server: Server | undefined;

	constructor(rootUrl: string = '', logPrefix: string = '') {
		const log = console.log;
		console.log = (...data) => log(logPrefix, ...data);
		rootUrls.push(rootUrl);
	}

	private addRequest({ url, method, callback, middlewares }: RequestListener) {
		url = url.endsWith('/') ? url : url + '/';
		requestsListeners.push({ url: rootUrls.join('') + url, method, callback, middlewares });
		console.log(`METHOD: ${method}; URL: ${url}; MIDDLEWARES: ${middlewares.length};`);
	}

	public get(url: string, callback: (req: Request, res: Response) => void, ...middlewares: Array<(req: Request, res: Response) => void>) {
		this.addRequest({ url, callback, middlewares, method: 'GET' });
	}

	private static createServer(requestListener: (req: Request, res: Response) => void) {
		return http.createServer(requestListener as (req: IncomingMessage, res: ServerResponse) => void);
	}

	public listen(port: string | number, callback: () => void) {
		this.server = AHF.createServer(async (req: Request, res: Response) => {
			res.json = (data: any) => res.setHeader('Content-Type', 'application/json').write(JSON.stringify(data));

			const buffers = [];

			for await (const chunk of req) {
				buffers.push(chunk);
			}

			req.body = JSON.parse(Buffer.concat(buffers).toString());

			for (const request of requestsListeners) {
				if (request.middlewares.length > 0) {
					for (const middleware of request.middlewares) {
						middleware(req, res);
					}
				}

				if (request.url === req.url && request.method === req.method) {
					request.callback(req, res);
				}
			}

			res.end();
		});

		this.server.listen(port, callback);
	}

}

export default AHF;