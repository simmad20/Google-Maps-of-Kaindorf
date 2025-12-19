"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClientOnlyValue = useClientOnlyValue;
var react_1 = require("react");
// `useEffect` is not invoked during server rendering, meaning
// we can use this to determine if we're on the server or not.
function useClientOnlyValue(server, client) {
    var _a = react_1.default.useState(server), value = _a[0], setValue = _a[1];
    react_1.default.useEffect(function () {
        setValue(client);
    }, [client]);
    return value;
}
