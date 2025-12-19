"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
// Die Konfigurationsparameter des Backend-Servers
//   - Beim Developen sollte die IP-Adresse des Clients genommen werden, wo das Backend gestartet wird.
//   - Der Port des Backends steht in der bin/www.js Datei vom Express-Server. Dort kann er auch verändert werden.
exports.serverConfig = {
    dns: 'kainfind.uber.space/api',
};
