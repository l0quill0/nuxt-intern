import {
  type IPostOffice,
  type IRegion,
  type ISettlement,
} from "~/types/postOffice.types";

export function getRegions() {
  return useApi<IRegion[]>(`/post/regions`, {
    method: "GET",
  });
}

export function getSettlements(regionId: number) {
  return useNuxtApp().$api<ISettlement[]>(`/post/regions/${regionId}`, {
    method: "GET",
  });
}

export function getPostOffices(settlementId: number) {
  return useNuxtApp().$api<IPostOffice[]>(`/post/${settlementId}`, {
    method: "GET",
  });
}
