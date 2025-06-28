import { Construct } from 'constructs'
import { BlockPublicAccess, Bucket, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3'

export interface PersistentS3 {
    Buckets: {
        Web: IBucket
    }
}

export class S3 extends Construct {
    public readonly resources: PersistentS3

    constructor(scope: Construct, id: string) {
        super(scope, id)

        this.resources = {
            Buckets: {
                Web: new Bucket(this, 'Bucket', {
                    blockPublicAccess: new BlockPublicAccess({
                        blockPublicAcls: false,
                        blockPublicPolicy: false,
                        ignorePublicAcls: false,
                        restrictPublicBuckets: false,
                    }),
                    objectOwnership: ObjectOwnership.OBJECT_WRITER,
                }),
            },
        }
    }
}
