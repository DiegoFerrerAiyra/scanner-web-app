import { environmentCommon } from "src/environments/environment.common";

export const environment = {
    production: true,
    ...environmentCommon,

    // WAF-PROTECTION
    WAF: {
      REGION: 'us-west-2',
      IDENTIFIER: '531ed0153966',
      TOKEN: '21a0adbce995',
      SKIP_KEY: '',
    },

    APIS:{
      MONOLITH_URL: 'https://api.modak.live/v1',
      USERS_DOMAIN_URL: 'https://rest.api.modak.live/users',
      BANKING_DOMAIN_URL: 'https://rest.api.modak.live/banking',
    },

    AUTH_VARS:{
        DOMAIN: 'auth.mia.modakmakers.com',
        CLIENT_ID: '650udd167dpapo9fbhcvjud4ra',
        REDIRECT_URI: 'https://mia.modakmakers.com/auth'
    },
    API_URL: 'https://api.modak.live/v1',
    USERS_URL: 'https://users.api.modak.live/v1',
    USERS_API_URL: 'https://users.api.modak.live/v1',
    BANKING_API_URL: 'https://banking.api.modak.live/v1',
    LEDGER_API_URL: 'https://rest.api.modak.live/ledger',
    
    CONTEST_ID: 'f8f24297-0a52-41c5-b7fc-fb65f858454c',

    firebase: {
      ...environmentCommon.firebase,
      usersAllowed: [
        ...environmentCommon.firebase.usersAllowed
      ],
    },
    SOLID:{
      ...environmentCommon.SOLID,
      ENV: 'live'
    },
    ACCOUNT_CANCELATION_USERS_ACCEPTED: [
      'freddy.esteban.serrano@modak.live',
      'tatiana.posse@modak.live',
      'sebastian.rivera@modak.live',
      'daniela.forero@modak.live',
      'natalia.ospina@modak.live'
    ],
    CARD_MANAGEMENT_USERS_ACCEPTED: [
      'freddy.esteban.serrano@modak.live',
      'daniela.forero@modak.live',
      'sebastian.rivera@modak.live',
      'tatiana.posse@modak.live',
      'lorna.mendez@modak.live',
      'carlos.aparicio@modak.live',
      'maria.cantor@modak.live',
      'laura.saenz@modak.live',
      'daniel.beltran@modak.live',
      'angelli.davila@modak.live',
      'julian.gomez@modak.live',
      'fatima.sanchez@modak.live',
      'carolina.huerfano@modak.live',
      'gunashree@modak.live',
      'lorena.bryan@modak.live',
      'sofia.poveda@modak.live',
      'andrea.chirinos@modak.live',
      'diego.roa@modak.live',
      'david.lozano@modak.live',
    ],
    TRANSFER_MANAGEMENT_USERS_ACCEPTED: [
      'freddy.esteban.serrano@modak.live',
      'daniela.forero@modak.live',
      'sebastian.rivera@modak.live',
      'tatiana.posse@modak.live',
      'lorna.mendez@modak.live',
      'angelli.davila@modak.live',
      'carlos.aparicio@modak.live',
      'daniel.beltran@modak.live',
      'maria.cantor@modak.live',
    ],
}