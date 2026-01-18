// Die Konfigurationsparameter des Backend-Servers
//   - Beim Developen sollte die IP-Adresse des Clients genommen werden, wo das Backend gestartet wird.
//   - Der Port des Backends steht in der bin/www.js Datei vom Express-Server. Dort kann er auch verändert werden.
import {URL_START} from "@/config";

export const serverConfig = {
    dns: URL_START.DEV + '/api',
}