import axiosInstance from './axiosInstance';

export const createRecord = async (recordData: {
    animalId: string,
    recordType: string,
    description?: string,
    details?: object,
}) => {
    try {
        const response = await axiosInstance.post('/records', recordData);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

// Remove legacy methods after migration to new getRecords
// export const getRecordsByUser = async (userId: string) => {
//     try {
//         const response = await axiosInstance.get(`/records/user/${userId}`);
//         return { status: response.status, data: response.data };
//     } catch (error: any) {
//         console.error(error);
//         return { status: error.response?.status || 500, data: error.response?.data || {} };
//     }
// };

// export const getRecordsByAnimal = async (animalId: string) => {
//     try {
//         const response = await axiosInstance.get(`/records/animal/${animalId}`);
//         return { status: response.status, data: response.data };
//     } catch (error: any) {
//         console.error(error);
//         return { status: error.response?.status || 500, data: error.response?.data || {} };
//     }
// };

export const getRecordById = async (recordId: string) => {
    try {
        const response = await axiosInstance.get(`/records/${recordId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const updateRecord = async (recordId: string, updateData: {
    description?: string,
    details?: object,
}) => {
    try {
        const response = await axiosInstance.patch(`/records/${recordId}`, updateData);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const deleteRecord = async (recordId: string) => {
    try {
        const response = await axiosInstance.delete(`/records/${recordId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getRecords = async (filters: {
    animalId?: string,
    userId?: string,
    recordType?: string,
    dateFrom?: string,
    dateTo?: string,
} = {}) => {
    try {
        const params = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const response = await axiosInstance.get('/records', { params });
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
