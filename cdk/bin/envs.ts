import { CertificateProps } from 'aws-cdk-lib/aws-certificatemanager'
import { Environment } from 'aws-cdk-lib'

export interface IEnvironment {
    readonly env?: Environment
    readonly envName: string
    readonly mainAccountId: string
    readonly dnsZone: string
    readonly domainRecord: string
    readonly certificates: {
        main: CertificateProps
        auth: CertificateProps
    }
}

export const EnvironmentDev: IEnvironment = {
    envName: "dev",
    mainAccountId: '652410103066',
    env: { account: '635811738483', region: 'us-west-2' },
    dnsZone: 'dev.modakmakers.com',
    domainRecord: 'mia.dev.modakmakers.com',
    certificates: {
        main: {
            domainName: 'mia.dev.modakmakers.com',
        },
        auth: {
            domainName: 'auth.mia.dev.modakmakers.com',
        },
    },
}

export const EnvironmentProd: IEnvironment = {
    envName: "prod",
    mainAccountId: '652410103066',
    env: { account: '200234554303', region: 'us-west-2' },
    dnsZone: 'modakmakers.com',
    domainRecord: 'mia.modakmakers.com',
    certificates: {
        main: {
            domainName: 'mia.modakmakers.com',
        },
        auth: {
            domainName: 'auth.mia.modakmakers.com',
        },
    },
}

export function LoadEnvironment(): IEnvironment {
    const env = (process.env.MdkEnvironment || 'dev').toLowerCase()
    if (env == 'prod') {
        return EnvironmentProd
    } else if (env == 'dev') {
        return EnvironmentDev
    } else {
        throw Error('invalid env: ' + env)
    }
}
