import { CollectionConfig } from "payload/types";
import { afterAPKUpload, afterIPAUpload } from "../upload-hook";


const APKLib: CollectionConfig = {
    slug: "apklib",
    fields:[
        {
            name: "version",
            type: "text",
            label: "版本号",
            admin: {
                readOnly: true
            }
        },
        {
            name: "build",
            type: "text",
            label: "构建号",
            admin: {
                readOnly: true
            }
        },
        {
            name: "bundleid",
            type: "text",
            label: "包名",
            admin: {
                readOnly: true
            }
        },
    ],
    labels: {
        singular: "APK文件",
        plural: "APK文件库"
    },
    upload: {
        staticDir: (process.env.UPLOAD_DIR || __dirname + "/..") + "/apk",
        staticURL: "/apk"
    },
    hooks: {
        afterChange: [afterAPKUpload]
    },
    admin: {
        disableDuplicate: true,
    },
    access: {
        update: ()=> false,
        read: ()=> true
    }
}

export default APKLib;