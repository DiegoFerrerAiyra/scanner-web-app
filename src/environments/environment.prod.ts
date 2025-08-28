import { environmentCommon } from "src/environments/environment.common";

export const environment = {
    production: true,
    ...environmentCommon,

    APIS:{
      MONOLITH_URL: 'https://api.modak.live/v1'
    },
    WS_URL: 'wss://nikola.fly.dev/ws' 



}