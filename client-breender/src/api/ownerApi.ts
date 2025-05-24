import axiosInstance from './axiosInstance';

export const getOwner = async (ownerId: string) => {
  try {
    const response = await axiosInstance.get(`owner/${ownerId}`);
    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    console.error(error);
    // @ts-expect-error: error may have response
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const getOwnerByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`owner/user/${userId}`);
    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    console.error(error);
    // @ts-expect-error: error may have response
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const createOwner = async (ownerData: { userId: string; animalIds?: string[] }) => {
  // Only send userId and animalIds (no tags or customData)
  try {
    const response = await axiosInstance.post(`owner`, ownerData);
    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    console.error(error);
    // @ts-expect-error: error may have response
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const updateOwner = async (
  ownerId: string,
  updateData: Partial<{ tags?: string[]; customData?: unknown; animalIds?: string[] }>
) => {
  // Only send tags/customData/animalIds for update
  try {
    const response = await axiosInstance.patch(`owner/${ownerId}`, updateData);
    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    console.error(error);
    // @ts-expect-error: error may have response
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const switchOwnerAvailability = async (ownerId: string, isAvailable: boolean) => {
  try {
    const response = await axiosInstance.patch(`owner/${ownerId}/switch-availability`, { isAvailable });
    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    console.error(error);
    // @ts-expect-error: error may have response
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};
