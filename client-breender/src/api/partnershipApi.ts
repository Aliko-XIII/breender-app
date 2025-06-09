import axiosInstance from './axiosInstance';

export const createPartnership = async (data: {
  requesterAnimalId: string,
  recipientAnimalId: string,
}) => {
  try {
    const response = await axiosInstance.post('/partnerships', data);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const getPartnerships = async (filters: {
  requesterAnimalId?: string,
  recipientAnimalId?: string,
  status?: string,
  userId?: string,
} = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const response = await axiosInstance.get('/partnerships', { params });
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const getPartnershipById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/partnerships/${id}`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const acceptPartnership = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/partnerships/${id}/accept`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const rejectPartnership = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/partnerships/${id}/reject`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const cancelPartnership = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/partnerships/${id}/cancel`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const deletePartnership = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/partnerships/${id}`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const requestPartnership = async ({ requesterAnimalId, recipientAnimalId }: { requesterAnimalId: string, recipientAnimalId: string }) => {
  try {
    const response = await axiosInstance.post('/partnerships', { requesterAnimalId, recipientAnimalId });
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};

export const reopenPartnership = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/partnerships/${id}/reopen`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(error);
    return { status: error.response?.status || 500, data: error.response?.data || {} };
  }
};
