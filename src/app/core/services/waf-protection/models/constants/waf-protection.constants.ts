export const C_WAF_PROTECTION = {
    COOKIE_AWS_WAF_TOKEN: 'aws-waf-token',
    TITLE_ERROR_GET_TOKEN: 'AWS WAF - Get Token',
    MODAK_URL: '.modak.live',
    HEADERS: {
        ACTION: {
            KEY: 'x-amzn-waf-action',
            VALUES: {
                CHALLENGE: 'challenge'
            }
        },
        MODAK_WAF: {
            KEY: 'x-modak-waf',
            VALUES: {
                TRUE: 'true'
            }
        }
    },
} as const;