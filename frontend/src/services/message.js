import { axiosInstance } from "../lib/axios";

export const getUsers = async () => {
  try {
    const res = await axiosInstance.get("/messages/users");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message ||
      "Fetching Users failed. Please try again."
    );
  }
};

export const getMessages = async (id) => {
  try {
    const res = await axiosInstance.get(`/messages/users/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message ||
      "Fetching Messages failed. Please try again."
    );
  }
};

export const sendMessage = async ({ id, data }) => {
  try {
    const res = await axiosInstance.post(`/messages/send/${id}`, data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message ||
      "Message sent failed. Please try again."
    );
  }
};
