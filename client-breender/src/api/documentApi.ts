import axiosInstance from './axiosInstance';

export const uploadDocument = async (data: FormData) => {
    try {
        const response = await axiosInstance.post('/documents', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const fetchAnimalDocuments = async (animalId: string) => {
    try {
        const response = await axiosInstance.get(`/documents/animal/${animalId}`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const fetchUserDocuments = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/documents/user/${userId}`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const deleteDocument = async (documentId: string) => {
    try {
        const response = await axiosInstance.delete(`/documents/${documentId}`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
