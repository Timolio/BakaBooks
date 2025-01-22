export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        async fetchUser(userId) {
            this.user = await $fetch(`/api/users/${userId}`, {
                method: 'GET',
            });
        },
    },
});
