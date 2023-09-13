import Env from '@ioc:Adonis/Core/Env'
import {S3Client,PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';

class UploadS3 {
    async uploadFile(fileStream:string | Buffer,fileName:string){
        const client = new S3Client({
            region: Env.get('S3_REGION'),
            endpoint: Env.get('S3_ENDPOINT'),
            credentials: {
                accessKeyId: Env.get('S3_KEY'),
                secretAccessKey: Env.get('S3_SECRET'),
            }
        });

        const command = new PutObjectCommand({
            ACL: 'public-read',
            Bucket: Env.get('S3_BUCKET'),
            Body: fileStream,
            Key: fileName,
            ContentDisposition: 'inline',
            ContentType: 'application/pdf'
        });

        try {
            const data = await client.send(command);
            
            const result = {
                status: data.$metadata.httpStatusCode,
                endpoint: Env.get('S3_ENDPOINT'),
                bucket: Env.get('S3_BUCKET'),
                message: "success"
            } 
            return result;
        }catch(error){
            console.log(error);
            let result = {
                status: 500,
                endpoint: Env.get('S3_ENDPOINT'),
                bucket: Env.get('S3_BUCKET'),
                message: error.response.message
            }
            return result;
        }

    }

    async deleteFile(fileName:string){
        const client = new S3Client({
            region: Env.get('S3_REGION'),
            endpoint: Env.get('S3_ENDPOINT'),
            credentials: {
                accessKeyId: Env.get('S3_KEY'),
                secretAccessKey: Env.get('S3_SECRET'),
            }
        });

        const command = new DeleteObjectCommand({
            Bucket: Env.get('S3_BUCKET'),
            Key: fileName,
        });

        try {
            const data = await client.send(command);
            const result = {
                status: data.$metadata.httpStatusCode,
                marker: data.DeleteMarker,
                message: "success"
            } 
            return result;
        } catch (error) {
            console.log(error);
            let result = {
                status: 500,
                message: error.response.message
            }
            return result;
        }
    }
}

export default new UploadS3();