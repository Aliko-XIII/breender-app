import axiosInstance from './axiosInstance';

export const getMessagesByChat = async (chatId: string) => {
    try {
        const response = await axiosInstance.get(`/messages/chat/${chatId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getMessageById = async (messageId: string) => {
    try {
        const response = await axiosInstance.get(`/messages/${messageId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const sendMessage = async (data: {
    chatId: string,
    senderId: string,
    content: string,
}) => {
    try {
        const response = await axiosInstance.post('/messages', data);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
