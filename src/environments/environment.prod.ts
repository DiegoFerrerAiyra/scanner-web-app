import { environmentCommon } from "src/environments/environment.common";

export const environment = {
    production: true,
    ...environmentCommon,

    APIS:{
      MONOLITH_URL: 'https://api.modak.live/v1'
    },



}