import { Construct } from 'constructs'
import { Duration } from 'aws-cdk-lib'
import {
    AllowedMethods,
    CachePolicy,
    CachedMethods,
    Distribution,
    Function,
    FunctionCode,
    FunctionEventType,
    IDistribution,
    SSLMethod,
    SecurityPolicyProtocol,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { IBucket } from 'aws-cdk-lib/aws-s3'
import { ARecord, AaaaRecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager'

import { PersistentProps } from '../persistent-stack'

export interface PersistentCloudfront {
    Distributions: {
        Web: IDistribution
    }
}

export interface CloudfrontProps extends PersistentProps {
    WebBucket: IBucket
    WebCert: ICertificate
    Zone: IHostedZone
}

export class Cloudfront extends Construct {
    public readonly resources: PersistentCloudfront

    constructor(scope: Construct, id: string, props: CloudfrontProps) {
        super(scope, id)

        const funcRedirect = new Function(this, 'redirect-index', {
            code: FunctionCode.fromInline(`
                function handler(event) {
                    var request = event.request
                    var uri = request.uri

                    if (uri.match(/^\\/M[A-Z]{2,4}-\\d{1,5}\\//i)) {
                        var ticket = uri.split('/')[1]
                        if (!uri.includes('.')) {
                            request.uri = '/' + ticket + '/index.html'
                        }
                    }

                    return request
                }
            `),
        })

        const distribution = new Distribution(this, 'Distribution', {
            enabled: true,
            enableIpv6: true,
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(props.WebBucket),
                compress: true,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [
                    {
                        function: funcRedirect,
                        eventType: FunctionEventType.VIEWER_REQUEST,
                    },
                ],
            },
            domainNames: [props.domainRecord],
            certificate: props.WebCert,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2018,
            sslSupportMethod: SSLMethod.SNI,
            errorResponses: [
                {
                    ttl: Duration.minutes(10),
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                },
            ],
        })

        new ARecord(this, 'ARecord', {
            zone: props.Zone,
            recordName: props.domainRecord,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        })

        new AaaaRecord(this, 'AAARecord', {
            zone: props.Zone,
            recordName: props.domainRecord,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        })

        this.resources = {
            Distributions: {
                Web: distribution,
            },
        }
    }
}
