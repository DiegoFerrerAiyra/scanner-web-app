import { Construct } from 'constructs'
import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib'
import { AccountPrincipal, Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { IEnvironment } from '../bin/envs'
import { GlobalExported } from "./global-stack";
import { Cloudfront } from './persistent/cloudfront';
import { S3 } from './persistent/s3'

export interface PersistentProps extends StackProps, IEnvironment {
    GlobalStack: GlobalExported
}

export class PersistentStack extends Stack {
    private static readonly stackName: string = 'Persistent'

    constructor(scope: Construct, id: string, props: PersistentProps) {
        super(scope, `${id}${PersistentStack.stackName}`, props)

        // Tags para todos los recursos creados en este stack, se heredan recursivamente
        Tags.of(this).add('modak:environment', props.envName)
        Tags.of(this).add('modak:branch', 'main')
        Tags.of(this).add('modak:domain', id)
        Tags.of(this).add('modak:stack', PersistentStack.stackName)

        const zone = HostedZone.fromLookup(this, props.dnsZone, {
            domainName: props.dnsZone,
        })

        const s3 = new S3(this, 'S3')

        const distribution = new Cloudfront(this, 'Cloudfront', {
            ...props,
            WebBucket: s3.resources.Buckets.Web,
            WebCert: props.GlobalStack.CloudfrontCert,
            Zone: zone,
        })

        const role = new Role(this,"Deploy",{
            assumedBy: new AccountPrincipal(props.mainAccountId),
            roleName: "Github-BackofficeDeployment"
        })

        role.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["cloudformation:DescribeStacks"],
                resources: ["arn:aws:cloudformation:*:*:stack/BackofficePersistent/*"]
            })
        )

        s3.resources.Buckets.Web.grantReadWrite(role)
        s3.resources.Buckets.Web.grantPutAcl(role)
        s3.resources.Buckets.Web.grantDelete(role)
        distribution.resources.Distributions.Web.grantCreateInvalidation(role)

        new CfnOutput(this, 'BucketNameOutput', {
            exportName: 'Backoffice:bucket-name',
            value: s3.resources.Buckets.Web.bucketName,
        })

        new CfnOutput(this, 'DistributionIdOutput', {
            exportName: 'Backoffice:distribution-id',
            value: distribution.resources.Distributions.Web.distributionId,
        })
    }
}
