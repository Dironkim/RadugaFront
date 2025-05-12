// src/api/tagApi.ts
import api from "./base";
import { type Tag } from "@/types/models";

export const fetchTags = async (): Promise<Tag[]> => {
  const res = await api.get("/tags");
  return res.data;
};
