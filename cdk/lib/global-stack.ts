import { Construct } from 'constructs'
import { CfnOutput,Stack, StackProps, Tags } from 'aws-cdk-lib'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { IEnvironment } from '../bin/envs'

export interface GlobalProps extends StackProps, IEnvironment {}

export interface GlobalExported {
    CloudfrontCert: Certificate
}

export class GlobalStack extends Stack {
    private static readonly stackName: string = 'Global'

    public readonly exported: GlobalExported

    constructor(scope: Construct, id: string, props: GlobalProps) {
        super(scope, `${id}${GlobalStack.stackName}`, props)

        // Tags para todos los recursos creados en este stack, se heredan recursivamente
        Tags.of(this).add('modak:environment', props.envName)
        Tags.of(this).add('modak:branch', 'main')
        Tags.of(this).add('modak:domain', id)
        Tags.of(this).add('modak:stack', GlobalStack.stackName)

        const zone = HostedZone.fromLookup(this, props.dnsZone, {
            domainName: props.dnsZone,
        })

        const authCert = new Certificate(this, 'AdminCertificate', {
            ...props.certificates.auth,
            validation: CertificateValidation.fromDns(zone),
        })

        new CfnOutput(this, 'AuthCertOut', {
            exportName: `BackofficeGlobal:Certs:Auth`,
            value: authCert.certificateArn,
        })

        this.exported = {
            CloudfrontCert: new Certificate(this, 'CloudfrontCertificate', {
                ...props.certificates.main,
                validation: CertificateValidation.fromDns(zone),
            }),
        }
    }
}
