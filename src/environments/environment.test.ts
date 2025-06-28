import { environmentCommon } from "src/environments/environment.common";

//This environments only works with command `npm run test`
export const environment = {
    production: false,
    ...environmentCommon,

    APIS:{
        MONOLITH_URL: 'https://api.dev.modak.live/v1',
        USERS_DOMAIN_URL: 'https://rest.testing.dev.modak.live/users',
        BANKING_DOMAIN_URL: 'https://rest.testing.dev.modak.live/banking',
    },
    API_URL: 'https://api.dev.modak.live/v1',
    LEDGER_API_URL: 'https://rest.testing.dev.modak.live/ledger',
    // WAF PROTECTION
    WAF: {
        REGION: 'us-west-2',
        IDENTIFIER: '16877655b902',
        TOKEN: '1fcb5f7a3daf', //SANDBOX: 91150df7c6fe
        SKIP_KEY: 'Ex5bCDvlTsAirNTHHo5jvX2hpjoYCNmW',
    },

    firebase: {
        ...environmentCommon.firebase,
        usersAllowed: [
            ...environmentCommon.firebase.usersAllowed,
            'juancamilo.contreras@modak.live',
            'roman.lopez@modak.live'
        ],
    },
    AUTH_VARS: {
        DOMAIN: 'auth.mia.dev.modakmakers.com',
        CLIENT_ID: '6os5uqkueu872hreh1s4scucod',
        REDIRECT_URI: 'https://mia.dev.modakmakers.com/auth'
    },


    SOLID: {
        ...environmentCommon.SOLID,
        ENV: 'test'
    },
    ACCOUNT_CANCELATION_USERS_ACCEPTED: [
        "test@modak.live",
    ],
    CARD_MANAGEMENT_USERS_ACCEPTED: [
        "test@modak.live"
    ],
    TRANSFER_MANAGEMENT_USERS_ACCEPTED: [
        "test@modak.live"
    ],
}