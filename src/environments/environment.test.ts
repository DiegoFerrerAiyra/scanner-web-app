import { environmentCommon } from "src/environments/environment.common";

//This environments only works with command `npm run test`
export const environment = {
    production: false,
    ...environmentCommon,

    APIS:{
        MONOLITH_URL: 'https://api.dev.modak.live/v1'
    },

}