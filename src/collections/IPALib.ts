import { CollectionConfig } from "payload/types";
import { afterIPAUpload } from "../upload-hook";


const IPALib: CollectionConfig = {
    slug: "ipalib",
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
        singular: "IPA文件",
        plural: "IPA文件库"
    },
    upload: {
        staticDir: (process.env.UPLOAD_DIR || __dirname + "/..") + "/ipa",
        staticURL: "/ipa"
    },
    hooks: {
        afterChange: [afterIPAUpload]
    },
    admin: {
        disableDuplicate: true,
    },
    access: {
        update: ()=> false,
        read: ()=> true
    }
}

export default IPALib;