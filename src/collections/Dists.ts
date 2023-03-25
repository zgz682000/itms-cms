import { CollectionConfig } from "payload/types";
import {afterChange, afterDelete} from "../upload-hook";
import distAppComp from "../components/dist-app-comp";
import qrcodeComp from "../components/qrcode-comp";


const Dists: CollectionConfig = {
    slug: "dists",
    labels: {
        singular: "发布版本",
        plural: "发布版本"
    },
    admin: {
        useAsTitle: "desc",
        defaultColumns: [
            "desc",
            "app"
        ],
        disableDuplicate: true,
        preview: async (doc, operation): Promise<string>=>{
            if (!doc.id){
                return null;
            }
            return process.env.PAYLOAD_PUBLIC_SERVER_URL + "/dist-info?distId=" + doc.id;
        }
    },
    fields: [
        {
            name: "app",
            type: "relationship",
            label: "选择项目",
            required: true,
            relationTo: "app",
            access: {
                update: ()=>false
            },
            admin: {
                components: {
                    Field: distAppComp
                }
            }
        },
        {
            name: "appSupportIos",
            type: "checkbox",
            admin: {
                hidden: true,
            }
        },
        {
            name: "appSupportAndroid",
            type: "checkbox",
            admin: {
                hidden: true,
            }
        },
        {
            name: "ipa",
            label: "上传ipa文件",
            type: "relationship",
            relationTo: "ipalib",
            access: {
                update: (args)=>!args.doc?.ipa
            },
            admin: {
                condition: (data)=> data.appSupportIos
            }
        },
        {
            name: "apk",
            label: "上传apk文件",
            type: "relationship",
            relationTo: "apklib",
            access: {
                update: (args)=>!args.doc?.apk
            },
            admin: {
                condition: (data)=> data.appSupportAndroid
            }
        },
        {
            name: "desc",
            type: "text",
            label: "说明",
            admin: {
                description: "不填写时，自动设置为ipa或apk的版本信息"
            }
        },
        {
            name: "enable",
            label: "是否启用",
            type: "checkbox",
            defaultValue: true,
            required: true
        },
        {
            name: "qrcode",
            type: "ui",
            admin: {
                position: "sidebar",
                components: {
                    Field: qrcodeComp
                }
            }
        }
    ],
    hooks: {
        afterChange: [afterChange],
        afterDelete: [afterDelete]
    }
}

export default Dists;