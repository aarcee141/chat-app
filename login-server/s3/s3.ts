import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import * as aws_s3_config from "./aws_s3_config.json";

const bucketName = aws_s3_config.aws_bucket_name
const region = aws_s3_config.aws_bucket_region
const accessKeyId = aws_s3_config.aws_access_key
const secretAccessKey = aws_s3_config.aws_secret_key

const s3 = new S3({
    region,
    credentials:{
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
})

// uploads a file to s3
export async function uploadFileToS3(file : any) {

    const uploadParams = {
        Bucket: bucketName,
        Body: file.data,
        Key: file.filename
    }

    return new Upload({
        client: s3,
        params: uploadParams,

    }).done();
}