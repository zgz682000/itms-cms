import React from "react";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import { useAllFormFields } from "payload/components/forms";

export default (props) => {
    const [fields, dispatch] = useAllFormFields();
    const appField = fields["app"];
    if(appField.value){
        fetch(process.env.PAYLOAD_PUBLIC_SERVER_URL + "/api/app/" + appField.value).then(e=>{
            return e.json()
        }).then(e=>{
            let supportAndroid = e.platforms.indexOf("android") != -1;
            if (fields["appSupportAndroid"].value != supportAndroid){
                dispatch({type: "UPDATE", path: "appSupportAndroid", value: supportAndroid})
            }
            let supportIos = e.platforms.indexOf("ios") != -1;
            if (fields["appSupportIos"].value != supportIos){
                dispatch({type: "UPDATE", path: "appSupportIos", value: supportIos})
            }
        });
    }else{
        if (fields["appSupportAndroid"].value){
            dispatch({type: "UPDATE", path: "appSupportAndroid", value: false})
        }
        if (fields["appSupportIos"].value){
            dispatch({type: "UPDATE", path: "appSupportIos", value: false})
        }
    }
    return <fieldTypes.relationship {...props}></fieldTypes.relationship>
}
