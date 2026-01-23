import type {
  ICategory,
  ICategoryQuery,
  ICategoryPaginated,
  ICreateCategory,
} from "~/types/category.types";

export function getCategories() {
  return useApi<ICategory[]>("/category/all", {
    method: "GET",
    key: "categories",
  });
}

export function getCategoryBySlug(slug: string) {
  return useApi<ICategory>(`/category/${slug}`, {
    method: "GET",
  });
}

export function getPaginatedCategories(query?: Ref<ICategoryQuery>) {
  return useApi<ICategoryPaginated>("/category", {
    method: "GET",
    query: query,
    key: "category-paginated",
  });
}

export function createCategory(data: ICreateCategory) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("file", data.image);

  return useNuxtApp().$api(`/category`, {
    method: "POST",
    body: formData,
  });
}

export function updateCategory(slug: string, image: File) {
  const formData = new FormData();
  formData.append("file", image);

  return useNuxtApp().$api(`/category/${slug}`, {
    method: "PATCH",
    body: formData,
  });
}

export function deleteCategory(slug: string) {
  return useNuxtApp().$api(`/category/${slug}`, {
    method: "DELETE",
  });
}
