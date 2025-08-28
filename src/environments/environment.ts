import { environmentCommon } from "src/environments/environment.common";

const devEmails = ['*']

export const environment = {
    production: false,
    ...environmentCommon,

    APIS:{
      MONOLITH_URL: 'https://api.dev.modak.live/v1'
    },
}