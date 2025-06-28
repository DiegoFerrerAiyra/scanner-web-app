export const CEmailValidatorRegex = /^(([^<>()[\]\\.,;:\s@!#$%&~"]+(\.[^<>()[\]\\.,;:\s@!#$%&~"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const CProhibitedCountryDomains = [
    'af', 'al', 'bb', 'by', 'ba', 'bg', 'mm', 'ky', 'cn', 'hr', 'cu', 'cy', 'er', 'et', 'gi', 'ht', 'hk', 'ir', 'iq', 'jm', 'jo',
    'kp', 'xk', 'lb', 'lr', 'ly', 'ml', 'mz', 'me', 'mk', 'ng', 'pa', 'ph', 'ro', 'ru', 'sn', 'rs', 'si', 'so', 'za', 'ss', 'lk',
    'sd', 'sy', 'tz', 'tr', 'ug', 'ua', 'ae', 've', 'vn', 'ye', 'zw'
  ] as const;
  