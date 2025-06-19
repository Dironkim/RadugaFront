import api from "@/api/base";
import { getAuthHeader } from "./auth";
import { type Message } from "@/types/models";

export const fetchChatMessages = async (partnerId: string): Promise<Message[]> => {
    const res = await api.get(`/chat/${partnerId}`, getAuthHeader());
    return res.data;
  };