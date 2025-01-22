import { User } from '~/server/models/user.model';
import { Channel } from '~/server/models/channel.model';

const config = useRuntimeConfig();
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${config.BOT_TOKEN}`;

export default defineEventHandler(async event => {
    const userId = Number(event.context.params.id);

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        });
    }

    try {
        console.log(userId);
        const user = await User.findById(userId).populate(
            'channels',
            {},
            Channel
        );

        const updatedChannels = await Promise.all(
            user.channels.map(async channel => {
                const channelInfo = await fetchChannelInfo(channel._id);
                return channelInfo
                    ? { ...channel.toObject(), ...channelInfo }
                    : channel;
            })
        );

        return {
            ...user.toObject(),
            channels: updatedChannels,
        };
    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
        });
    }
});

const fetchChannelInfo = async channelId => {
    try {
        const response = await $fetch(
            `${TELEGRAM_API_BASE}/getChat?chat_id=${channelId}`
        );
        return response.result;
    } catch (error) {
        console.error(`Failed to fetch info for channel ${channelId}:`, error);
        return null;
    }
};
