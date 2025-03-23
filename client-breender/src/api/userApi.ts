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