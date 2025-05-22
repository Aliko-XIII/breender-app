import axiosInstance from './axiosInstance';

export const getOwner = async (ownerId: string) => {
  try {
    const response = await axiosInstance.get(`owner/${ownerId}`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const getOwnerByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`owner/user/${userId}`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const switchOwnerAvailability = async (ownerId: string, isAvailable: boolean) => {
  try {
    const response = await axiosInstance.patch(`owner/${ownerId}/switch-availability`, { isAvailable });
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};
