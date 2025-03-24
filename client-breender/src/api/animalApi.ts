import axiosInstance from "./axiosInstance";

export const getUserAnimals = async (
    userId: string,
) => {
    try {
        const response = await axiosInstance.get(
            `users/${userId}/animals`,
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};