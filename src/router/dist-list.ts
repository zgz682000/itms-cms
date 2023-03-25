import { NextFunction, Request, Response } from "express";
import payload from "payload";


export default async (req: Request, res: Response, next: NextFunction)=>{
    let appId = req.query.appId as string;
    if (!appId){
        next("query field not found: appId");
        return;
    }
    let app: any;
    try {
        app = await payload.findByID({
            collection: "app",
            id: appId
        });
    } catch (error) {
        next(error)
        return;
    }
    
    if (!app){
        next("app not found: " + appId);
        return;
    }
    let result = await payload.find({
        collection: "dists",
        where: {
            app: {
                equals: appId
            },
            enable: {
                equals: true
            }
        }
    })
    res.render("dist-list", {
        dists: result.docs.map(e=>{
            return {
                ...e,
                createDate: new Date(e.createdAt).toLocaleString()
            }
        }),
        app: app
    });
}