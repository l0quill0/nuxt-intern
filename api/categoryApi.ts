import type {
  ICategory,
  ICategoryQuery,
  ICategoryPaginated,
} from "~/types/category.types";

export function getCategories() {
  return useApi<ICategory[]>("/category/all", {
    method: "GET",
    key: "categories",
  });
}

export function getPaginatedCategories(query?: Ref<ICategoryQuery>) {
  return useApi<ICategoryPaginated>("/category", {
    method: "GET",
    query: query,
    key: "category-paginated",
  });
}

export function getCategoryById(id: number) {
  return useApi<ICategory>(`/category/${id}`, {
    method: "GET",
  });
}

export async function createCategory(image: File, name: string) {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("name", name);

  return useNuxtApp().$api(`/category`, {
    method: "POST",
    body: formData,
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; image?: File }
) {
  const formData = new FormData();
  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.image) {
    formData.append("file", data.image);
  }

  return useNuxtApp().$api(`/category/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteCategory(id: number) {
  return useNuxtApp().$api(`/category/${id}`, {
    method: "DELETE",
  });
}
