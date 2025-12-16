import type { ICategoryPaginated } from "~/Types/category.paginated";
import type { IcategoryQuery } from "~/Types/category.query";
import type { ICategory } from "~/Types/category.type";

export function getCategories() {
  return useApi<ICategory[]>("category/all", {
    method: "GET",
    key: "categories",
  });
}

export function getPaginatedCategories(query: Ref<IcategoryQuery>) {
  return useApi<ICategoryPaginated>("category", {
    method: "GET",
    query: query,
    key: "category-paginated",
  });
}

export async function createCategory(image: File, name: string) {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("name", name);

  return useNuxtApp().$api(`category`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteCategory(id: number) {
  return useNuxtApp().$api(`category/${id}`, {
    method: "DELETE",
  });
}
