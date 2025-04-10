import axiosInstance from './axiosInstance';

export const uploadDocument = async (data: FormData) => {
    try {

        const response = await axiosInstance.post('/documents', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
