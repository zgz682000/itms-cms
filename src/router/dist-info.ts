import { NextFunction, Request, Response } from "express";
import payload from "payload";


export default async (req: Request, res: Response, next: NextFunction) => {
    let distId = req.query.distId as string;
    if (!distId){
        next("query field not found: distId");
        return;
    }
    let dist: any
    try {
        dist = await payload.findByID({
            collection: "dists",
            id: distId
        })
    } catch (error) {
        next(error);
        return;
    }
    if (!dist){
        next("dist not found: " + distId);
        return;
    }
    res.render("dist-info", {
        dist: {
            ...dist,
            createDate: new Date(dist.createdAt).toLocaleString()
        }
    });
}