import { environmentCommon } from "src/environments/environment.common";

const devEmails = ['*']

export const environment = {
    production: false,
    ...environmentCommon,

    // WAF PROTECTION
    WAF: {
      REGION: 'us-west-2',
      IDENTIFIER: '16877655b902',
      TOKEN: '1fcb5f7a3daf', //SANDBOX: 91150df7c6fe
      SKIP_KEY: 'Ex5bCDvlTsAirNTHHo5jvX2hpjoYCNmW',
    },

    APIS:{
      MONOLITH_URL: 'https://api.dev.modak.live/v1',
      USERS_DOMAIN_URL: 'https://rest.testing.dev.modak.live/users',
      BANKING_DOMAIN_URL: 'https://rest.testing.dev.modak.live/banking',
    },


    firebase: {
      ...environmentCommon.firebase,
      usersAllowed: [
        ...environmentCommon.firebase.usersAllowed,
        'juancamilo.contreras@modak.live',
        'roman.lopez@modak.live'
      ],
    },

    AUTH_VARS:{
      DOMAIN: 'auth.mia.dev.modakmakers.com',
      CLIENT_ID: '6os5uqkueu872hreh1s4scucod',
      REDIRECT_URI: 'https://mia.dev.modakmakers.com/auth'
    },
    API_URL: 'https://api.dev.modak.live/v1',
    USERS_URL: 'https://users.dev.modak.live/v1',
    USERS_API_URL: 'https://users.dev.modak.live/v1',
    BANKING_API_URL: 'https://banking.dev.modak.live/v1',
    LEDGER_API_URL: 'https://rest.testing.dev.modak.live/ledger',
    CONTEST_ID: 'a9534fcc-efe9-42f0-a5d1-c43aa5d96a8c',

    SOLID:{
      ...environmentCommon.SOLID,
      ENV: 'test'
    },

    ACCOUNT_CANCELATION_USERS_ACCEPTED: [...devEmails],
    CARD_MANAGEMENT_USERS_ACCEPTED: [...devEmails],
    TRANSFER_MANAGEMENT_USERS_ACCEPTED: [...devEmails],
}