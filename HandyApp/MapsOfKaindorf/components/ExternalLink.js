"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalLink = ExternalLink;
var expo_router_1 = require("expo-router");
var WebBrowser = require("expo-web-browser");
var react_1 = require("react");
var react_native_1 = require("react-native");
function ExternalLink(props) {
    return (<expo_router_1.Link target="_blank" {...props} 
    // @ts-expect-error: External URLs are not typed.
    href={props.href} onPress={function (e) {
            if (react_native_1.Platform.OS !== 'web') {
                // Prevent the default behavior of linking to the default browser on native.
                e.preventDefault();
                // Open the link in an in-app browser.
                WebBrowser.openBrowserAsync(props.href);
            }
        }}/>);
}
