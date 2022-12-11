import { Request, Response } from "express";

export const home = async (_req:Request, res:Response) => {
    res.render('home');
}