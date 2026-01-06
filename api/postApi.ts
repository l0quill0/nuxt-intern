import type { IPostOffice } from "~/types/post.office.type";

export async function getRegions() {
  return useApi<{ id: number; name: string }[]>(`/post/regions`, {
    method: "GET",
  });
}

export async function getSettlements(regionId: number) {
  return useApi<{ id: number; name: string }[]>(`/post/regions/${regionId}`, {
    method: "GET",
  });
}

export async function getPostOffices(settlementId: number) {
  return useApi<IPostOffice[]>(`/post/${settlementId}`, {
    method: "GET",
  });
}
