import { Collection, CollectionConfig } from "payload/dist/collections/config/types";


const App: CollectionConfig = {
    slug: "app",
    labels: {
        plural: "项目",
        singular: "项目"
    },
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: "name",
            label: "项目名",
            type: "text",
            required: true
        },
        {
            name: "platforms",
            label: "选择平台",
            admin: {
                description: "多选",
            },
            type: "select",
            options: [
                {
                    value: "ios",
                    label: "iOS",
                },
                {
                    value: "android",
                    label: "安卓"
                }
            ],
            hasMany: true,
            required: true,
        },
        {
            name: "enable",
            label: "是否启用",
            type: "checkbox",
            defaultValue: true,
            required: true
        }
    ]
}


export default App;