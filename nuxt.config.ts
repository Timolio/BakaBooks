// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },

    runtimeConfig: {
        MONGODB_URI: process.env.MONGODB_URI,
        GOOGLE_CLOUD_CREDENTIALS: process.env.GOOGLE_CLOUD_CREDENTIALS,
        GOOGLE_CLOUD_BUCKET_NAME: process.env.GOOGLE_CLOUD_BUCKET_NAME,
        BOT_TOKEN: process.env.BOT_TOKEN,
        public: {
            BOT_ID: process.env.BOT_ID,
        },
    },

    css: [
        '~/assets/css/main.css',
        '@fortawesome/fontawesome-svg-core/styles.css',
    ],

    bootstrapIcons: {
        display: 'inline',
    },

    modules: ['@pinia/nuxt', '@vueuse/nuxt', 'nuxt-bootstrap-icons'],

    devServer: {
        host: "nuxt --hostname '0' --port 8000",
    },
});
