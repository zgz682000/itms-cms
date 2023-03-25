import { NextFunction, Request, Response } from "express";
import payload from "payload";

export default async (req: Request, res: Response, next: NextFunction)=>{
    let result = await payload.find({
        collection: "app",
        pagination: false,
        where: {
            enable: {
                equals: true
            }
        }
    });
    res.render("app-list", {
        title: process.env.PAYLOAD_PUBLIC_TITLE_SUFFIX,
        apps: result.docs.map(e=>{
        return {
            id: e.id,
            name: e.name,
            bundleid: e.bundleid,
            platforms: e.platforms
        }
    })});
}