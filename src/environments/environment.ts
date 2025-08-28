import { environmentCommon } from "src/environments/environment.common";

const devEmails = ['*']

export const environment = {
    production: false,
    ...environmentCommon,

    APIS:{
      MONOLITH_URL: 'https://api.dev.modak.live/v1'
    },
    WS_URL: 'ws://localhost:8000/ws' 
}