import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

const config = useRuntimeConfig();
const credentials = JSON.parse(config.GOOGLE_CLOUD_CREDENTIALS);

const storage = new Storage({
    credentials,
});
const bucketName = config.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default defineEventHandler(async event => {
    const contentType = getHeader(event, 'Content-Type');

    if (!allowedMimeTypes.includes(contentType)) {
        return {
            statusCode: 400,
            body: {
                message: 'Invalid file type',
            },
        };
    }

    const uniqeFileName = uuidv4();

    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
    };

    try {
        const [url] = await bucket.file(uniqeFileName).getSignedUrl(options);
        return {
            statusCode: 200,
            body: {
                url,
                pub: `https://storage.googleapis.com/${bucketName}/${uniqeFileName}`,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: {
                message: 'Internal server error',
            },
        };
    }
});
