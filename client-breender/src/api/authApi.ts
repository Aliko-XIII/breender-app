import axios from 'axios';

export const registerUser = async (email: string, pass: string) => {
    axios.post(
        `http://localhost:3000/api/v1/auth/register`,
        { email, pass }
    ).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    });
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