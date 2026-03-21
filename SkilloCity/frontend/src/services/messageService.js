import api from './api';

export const messageService = {
    async getConversations() {
        const { data } = await api.get('/conversations');
        return data;
    },
    async getMessages(conversationId) {
        const { data } = await api.get(`/conversations/${conversationId}/messages`);
        return data;
    },
    async sendMessage(conversationId, text) {
        const { data } = await api.post(`/conversations/${conversationId}/messages`, { text });
        return data;
    },
};

export default messageService;
