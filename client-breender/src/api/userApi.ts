import axios from 'axios';

export const getUser = async (userId:string, accessToken: string) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/users/${userId}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};