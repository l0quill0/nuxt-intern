import type { IPostOffice } from "~/types/post.office.type";

export async function getPostOffices(region: string) {
  return useApi<IPostOffice[]>(`/post`, {
    method: "GET",
    query: {
      region,
    },
  });
}
