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

export const getAnimal = async (
    animalId: string,
) => {
    try {
        const response = await axiosInstance.get(
            `animals/${animalId}`,
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const createAnimal = async (
    animalData: {
        name: string,
        sex: "MALE" | "FEMALE",
        breed: string,
        species: string,
        bio: string,
        birthDate: string,
    }
) => {
    try {
        const response = await axiosInstance.post(
            `/animals`,
            animalData
        );
        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error(error);
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};