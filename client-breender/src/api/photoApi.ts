import axiosInstance from './axiosInstance';

export const uploadPhoto = async (data: FormData) => {
    try {

        const response = await axiosInstance.post('/photos', data, {
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

export const fetchAnimalPhotos = async (animalId: string) => {
    try {
        const response = await axiosInstance.get(`/photos/animal/${animalId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const fetchUserPhotos = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/photos/user/${userId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const deletePhoto = async (photoId: string) => {
    try {
        const response = await axiosInstance.delete(`/photos/${photoId}`);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};
