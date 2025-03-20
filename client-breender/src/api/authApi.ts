import axios from 'axios';

export const registerUser = async (email: string, pass: string) => {
    try {
        const response = await axios.post(
            `http://localhost:3000/api/v1/auth/register`,
            { email, pass }
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const loginUser = async (email: string, pass: string) => {
    axios.post(
        `http://localhost:3000/api/v1/auth/login`,
        { email, pass }
    ).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    });
};