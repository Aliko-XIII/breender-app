import axiosInstance from './axiosInstance';

export const createReminder = async (reminderData: {
    animalId: string,
    reminderType: string,
    message?: string,
    remindAt: string,
}) => {
    try {
        const response = await axiosInstance.post('/reminders', reminderData);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getRemindersByUser = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/reminders/user/${userId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getRemindersByAnimal = async (animalId: string) => {
    try {
        const response = await axiosInstance.get(`/reminders/animal/${animalId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getReminderById = async (reminderId: string) => {
    try {
        const response = await axiosInstance.get(`/reminders/${reminderId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const updateReminder = async (reminderId: string, updateData: {
    reminderType?: string,
    message?: string,
    remindAt?: string,
}) => {
    try {
        const response = await axiosInstance.patch(`/reminders/${reminderId}`, updateData);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const deleteReminder = async (reminderId: string) => {
    try {
        const response = await axiosInstance.delete(`/reminders/${reminderId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getReminders = async (filters: {
    userId?: string,
    animalId?: string,
    reminderType?: string,
    message?: string,
    remindAtFrom?: string,
    remindAtTo?: string,
} = {}) => {
    try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axiosInstance.get(`/reminders${params.toString() ? `?${params.toString()}` : ''}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
