"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoText = MonoText;
var Themed_1 = require("./Themed");
function MonoText(props) {
    return <Themed_1.Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]}/>;
}
