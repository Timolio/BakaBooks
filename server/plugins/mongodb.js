import mongoose from 'mongoose';

export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig();

    try {
        await mongoose.connect(config.MONGODB_URI, { dbName: 'readriver' });
        console.log('Connected to MongoDB');
    } catch (e) {
        console.log(e);
    }
});
