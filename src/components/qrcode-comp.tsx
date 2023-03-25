
import React from "react"
const QRCode = require("qrcode");
export default (props) => {
    const pathComps = window.location.pathname.split("/");
    const id = pathComps[pathComps.length - 1];
    if (id == "create"){
        return null;
    }
    React.useEffect(()=>{
        const url = window.location.protocol + "//" + window.location.host + "/dist-info?distId=" + id;
        QRCode.toCanvas(document.getElementById('canvas'), url, {
            width: 300,
            margin: 2
        }, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    })
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
        }}>
            <canvas id="canvas"></canvas>
        </div>
    )
}