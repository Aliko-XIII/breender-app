import axiosInstance from './axiosInstance';

export const getChats = async () => {
    try {
        const response = await axiosInstance.get('/chats');
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getChatById = async (chatId: string) => {
    try {
        const response = await axiosInstance.get(`/chats/${chatId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const createChat = async (userIds: string[]) => {
    try {
        const response = await axiosInstance.post('/chats', { userIds });
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getChatParticipants = async (chatId: string) => {
    try {
        const response = await axiosInstance.get(`/chats/${chatId}/participants`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getChatMessages = async (chatId: string) => {
    try {
        const response = await axiosInstance.get(`/chats/${chatId}/messages`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
