import { data } from 'react-router-dom';
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