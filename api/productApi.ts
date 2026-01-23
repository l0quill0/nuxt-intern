import {
  type IProduct,
  type ICreateComment,
  type ICreateProduct,
  type IProductQuery,
  type IUpdateProduct,
  type IProductsPaginated,
  type ICommentPaginated,
  type IProductWithScore,
} from "~/types/product.types";

export function getProductById(productId: number) {
  return useApi<IProductWithScore & { isInFavourites: boolean }>(
    `/product/${productId}`,
    {
      method: "GET",
    },
  );
}

export function getPaginatedProducts(queryOptions: Ref<IProductQuery>) {
  return useApi<IProductsPaginated>(`/product`, {
    method: "GET",
    query: queryOptions,
    key: "items-paginated",
  });
}

export function getSuggestedProducts(
  productId: number,
  productCount: number = 3,
) {
  return useApi<IProduct[]>(`/product/suggestions`, {
    method: "GET",
    query: { productId, productCount },
  });
}

export function createProduct(data: ICreateProduct) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("file", data.image);
  formData.append("category", data.category);

  return useNuxtApp().$api(`/product`, {
    method: "POST",
    body: formData,
  });
}

export function updateItem(productId: number, data: IUpdateProduct) {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.price) formData.append("price", data.price.toString());
  if (data.image) formData.append("file", data.image);
  if (data.category) formData.append("category", data.category);

  return useNuxtApp().$api(`/product/${productId}`, {
    method: "PATCH",
    body: formData,
  });
}

export function archiveProduct(productId: number) {
  return useNuxtApp().$api(`/product/${productId}/archive`, {
    method: "PATCH",
  });
}

export function unarchiveProduct(productId: number) {
  return useNuxtApp().$api(`/product/${productId}/unarchive`, {
    method: "PATCH",
  });
}

export function getComments(productId: number, page: Ref<number>) {
  return useApi<ICommentPaginated>(`/product/${productId}/comments`, {
    method: "GET",
    query: {
      page,
    },
  });
}

export function addComment(productId: number, body: ICreateComment) {
  return useNuxtApp().$api(`/product/${productId}/comments`, {
    method: "POST",
    body,
  });
}

export function deleteComment(productId: number, commentId: number) {
  return useNuxtApp().$api(`/product/${productId}/comments/${commentId}`, {
    method: "DELETE",
  });
}
