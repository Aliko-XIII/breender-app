import axiosInstance from './axiosInstance';

export const getUser = async (
    userId: string,
    includeProfile: boolean = false
) => {
    try {
        const response = await axiosInstance.get(
            `users/${userId}?include_profile=${includeProfile}`,
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const updateUser = async (
    userId: string,
    updateData: {
        email?: string,
        pass?: string,
        name?: string,
        bio?: string,
        pictureUrl?: string,
        phone?: string,
    }
) => {
    try {
        const response = await axiosInstance.patch(
            `users/${userId}`,
            updateData
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const uploadUserProfilePic = async (
    userId: string,
    file: File
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(
            `users/${userId}/profile-pic`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};