export interface APIRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: HeadersInit;
}

export const apiRequest = async (url: string, options: APIRequestOptions) => {
  const { method, body, headers } = options;

  try {
    const response = await fetch(`http://localhost:8000/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error in API Request");
    }

    //Body empty with POST / PUT / DELETE
    if (method !== "GET" && response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Auth

export async function login(data: any) {
  return await apiRequest(`api/auth/login`, {
    method: "POST",
    body: data,
  });
}

export async function register(data: any) {
  return await apiRequest(`api/auth/register`, {
    method: "POST",
    body: data,
  });
}

export async function orders() {
  return await apiRequest(`api/orders`, {
    method: "GET",
  });
}

export async function clients() {
  return await apiRequest(`api/clients`, {
    method: "GET",
  });
}

export async function products() {
  return await apiRequest(`api/products`, {
    method: "GET",
  });
}

export async function createOrder(data: any) {
  return await apiRequest(`api/order/create`, {
    method: "POST",
    body: data,
  });
}

export async function updateOrder(id: number, data: any) {
  return await apiRequest(`api/order/update/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteOrder(id: number) {
  return await apiRequest(`api/order/delete/${id}`, {
    method: "DELETE"
  });
}

export async function detailOrder(id: number) {
  return await apiRequest(`api/order/detail/${id}`, {
    method: "GET"
  });
}
