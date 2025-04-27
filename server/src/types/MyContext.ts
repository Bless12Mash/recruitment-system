import { Request } from "express";

export interface MyContext {
	req: Request;
	token?: string; // | string[];
}
