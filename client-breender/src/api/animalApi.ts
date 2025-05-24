import axiosInstance from "./axiosInstance";

export interface AnimalFilters {
    name?: string;
    species?: string;
    breed?: string;
    sex?: "MALE" | "FEMALE";
    birthdateFrom?: string;
    birthdateTo?: string;
    userId?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    bio?: string;
    isSterilized?: boolean;
    isAvailable?: boolean;
    tags?: string[];
}

export const getAnimal = async (
    animalId: string,
) => {
    try {
        const response = await axiosInstance.get(
            `animals/${animalId}`,
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getAnimals = async (
    filters?: AnimalFilters
) => {
    try {
        const params = filters ? { ...filters } : undefined;
        const response = await axiosInstance.get(
            `/animals`,
            { params }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getAnimalsForMap = async (
    filters?: AnimalFilters
) => {
    try {
        const params = filters ? { ...filters } : undefined;
        const response = await axiosInstance.get(
            `/animals/for-map`,
            { params }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const createAnimal = async (
    animalData: {
        name: string,
        sex: "MALE" | "FEMALE",
        breed: string,
        species: string,
        bio?: string,
        birthDate: string,
        latitude?: number,
        longitude?: number,
        profilePicUrl?: string,
        isSterilized?: boolean,
        customData?: Record<string, unknown>,
        tags?: string[],
    }
) => {
    try {
        const response = await axiosInstance.post(
            `/animals`,
            animalData
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const updateAnimal = async (
    animalId: string,
    animalData: Partial<{
        name: string,
        sex: "MALE" | "FEMALE",
        breed: string,
        species: string,
        bio?: string,
        birthDate?: string,
        latitude?: number,
        longitude?: number,
        profilePicUrl?: string,
        isSterilized?: boolean,
        isAvailable?: boolean,
        customData?: Record<string, unknown>,
        tags?: string[],
    }>
) => {
    try {
        const response = await axiosInstance.patch(
            `/animals/${animalId}`,
            animalData
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const uploadAnimalProfilePic = async (
    animalId: string,
    file: File | Blob
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(
            `/animals/${animalId}/profile-pic`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(error);
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || {} };
    }
};

export const getAnimalOwners = async (animalId: string) => {
    try {
        const response = await axiosInstance.get(`/animals/${animalId}/owners`);
        console.log(response.data);
        return { status: response.status, data: response.data };
    } catch (error) {
        // @ts-expect-error: error may not have response property
        return { status: error.response?.status || 500, data: error.response?.data || [] };
    }
};