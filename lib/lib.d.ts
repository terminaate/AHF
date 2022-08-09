import { IncomingMessage, ServerResponse } from 'http';

export type Request = IncomingMessage & any

export type Response = ServerResponse & {
	json: (data: any) => void
}

export type RequestListener = {
	url: string
	callback: (req: Request, res: Response) => void | any
	method: string
	middlewares: Array<(req: Request, res: Response) => void>
}