import type { ICategory } from "~/Types/category.type";

export async function getCategories() {
  return useApi<ICategory[]>("category", {
    method: "GET",
    key: "categories",
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
