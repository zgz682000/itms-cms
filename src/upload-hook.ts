import fs from "fs";
import payload from "payload";
import { PayloadRequest } from "payload/types";
import {IpaReader, ApkReader}  from "app-package-parser";

export const afterAPKUpload = async(args: {
    doc: any;
    req: PayloadRequest;
    previousDoc: any;
    operation: 'create' | 'update';
}) =>{
    if (args.operation == "update"){
        return;
    }
    let apkPath = (process.env.UPLOAD_DIR || __dirname) + "/apk/" + args.doc.filename;
    let apkRenamedPath = (process.env.UPLOAD_DIR || __dirname) + "/apk/" + args.doc.id + ".apk";
    if (fs.existsSync(apkRenamedPath)){
        fs.unlinkSync(apkRenamedPath);
    }
    fs.renameSync(apkPath, apkRenamedPath);
    let apkInfo: any;
    try {
        let apkReader = new ApkReader(apkRenamedPath);
        apkInfo = await apkReader.parse();
    } catch (error) {
        throw new Error("apk parse failure: " + ((error as Error).message || error));
    }
    await payload.update({
        collection: "apklib",
        id: args.doc.id,
        data: {
            url: process.env.PAYLOAD_PUBLIC_SERVER_URL + "/apk/" + args.doc.id + ".apk",
            filename: args.doc.id + ".apk",
            bundleid: apkInfo["package"],
            version: apkInfo["versionName"],
            build: apkInfo["versionCode"].toString()
        }
    })
}

export const afterIPAUpload = async (args: {
    doc: any;
    req: PayloadRequest;
    previousDoc: any;
    operation: 'create' | 'update';
}) => {
    if (args.operation == "update"){
        return;
    }
    let ipaPath = (process.env.UPLOAD_DIR || __dirname) + "/ipa/" + args.doc.filename;
    let ipaRenamedPath = (process.env.UPLOAD_DIR || __dirname) + "/ipa/" + args.doc.id + ".ipa";
    if (fs.existsSync(ipaRenamedPath)){
        fs.unlinkSync(ipaRenamedPath);
    }
    fs.renameSync(ipaPath, ipaRenamedPath);
    let ipaInfo: any;
    try {
        let ipaReader = new IpaReader(ipaRenamedPath);
        ipaInfo = await ipaReader.parse();
    } catch (error) {
        throw new Error("ipa parse failure: " + ((error as Error).message || error));
    }
    await payload.update({
        collection: "ipalib",
        id: args.doc.id,
        data: {
            url: process.env.PAYLOAD_PUBLIC_SERVER_URL + "/ipa/" + args.doc.id + ".ipa",
            filename: args.doc.id + ".ipa",
            bundleid: ipaInfo["CFBundleIdentifier"],
            version: ipaInfo["CFBundleShortVersionString"],
            build: ipaInfo["CFBundleVersion"]
        }
    })
}

export const afterDelete = (args: {
    doc: any;
    req: PayloadRequest;
    id: string;
})=>{
    let manifestPath = (process.env.UPLOAD_DIR || __dirname) + "/ipa/" + args.id + ".plist";
    if (fs.existsSync(manifestPath)){
        fs.unlinkSync(manifestPath);
    }
}

export const afterChange = async (args: {
    doc: any;
    req: PayloadRequest;
    previousDoc: any;
    operation: 'create' | 'update';
})=>{
    let appDoc = await payload.findByID({
        collection: "app",
        id: args.doc.app.id || args.doc.app,
    });
    
    if (args.doc.ipa){
        let ipaLibDoc = await payload.findByID({
            collection: "ipalib",
            id: args.doc.ipa.id || args.doc.ipa,
        });
        if (!args.doc.desc){
            await payload.update({
                collection: "dists",
                id: args.doc.id,
                data: {
                    desc: appDoc.name + "-" + ipaLibDoc.version + "(" + ipaLibDoc.build + ")"
                }
            })
        }
        let manifestPath = (process.env.UPLOAD_DIR || __dirname) + "/ipa/" + args.doc.id + ".plist";
        if (fs.existsSync(manifestPath)){
            fs.unlinkSync(manifestPath);
        }
        let manifestContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>items</key>
<array>
<dict>
    <key>assets</key>
    <array>
        <dict>
            <key>kind</key>
            <string>software-package</string>
            <key>url</key>
            <string>${ipaLibDoc.url}</string>
        </dict>
        <dict>
            <key>kind</key>
            <string>display-image</string>
            <key>url</key>
            <string>https://img.zongyiplay.com/itms/mj-icon-57.png</string>
        </dict>
        <dict>
            <key>kind</key>
            <string>full-size-image</string>
            <key>url</key>
            <string>https://img.zongyiplay.com/itms/mj-icon-512.png</string>
        </dict>
    </array>
    <key>metadata</key>
    <dict>
        <key>bundle-identifier</key>
        <string>${ipaLibDoc.bundleid}</string>
        <key>bundle-version</key>
        <string>${ipaLibDoc.version}</string>
        <key>kind</key>
        <string>software</string>
        <key>platform-identifier</key>
        <string>com.apple.platform.iphoneos</string>
        <key>title</key>
        <string>${appDoc.name}</string>
    </dict>
</dict>
</array>
</dict>
</plist>`
        fs.writeFileSync(manifestPath, manifestContent, {encoding: "utf-8"});
    }
    else if (args.doc.apk){
        let apkLibDoc = await payload.findByID({
            collection: "apklib",
            id: args.doc.apk.id || args.doc.apk,
        });
        if (!args.doc.desc){
            await payload.update({
                collection: "dists",
                id: args.doc.id,
                data: {
                    desc: appDoc.name + "-" + apkLibDoc.version + "(" + apkLibDoc.build + ")"
                }
            })
        }
    }
}