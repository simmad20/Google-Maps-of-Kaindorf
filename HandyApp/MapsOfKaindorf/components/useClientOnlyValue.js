"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClientOnlyValue = useClientOnlyValue;
// This function is web-only as native doesn't currently support server (or build-time) rendering.
function useClientOnlyValue(server, client) {
    return client;
}
