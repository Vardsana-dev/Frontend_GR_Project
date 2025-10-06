// import axios from 'axios'
// import { getStoredUserData, getAuthToken } from '@/lib/auth'

// const ALLPOBYPRO_ENDPOINT = process.env.ALLPOBYPRO_ENDPOINT || '/api/po/allPObyProduct';

// const createApiInstance = () => {
//     const userData = getStoredUserData()
//     const token = getAuthToken()

//     if (!userData || !token) {
//         throw new Error('User not authenticated')
//     }

//     return axios.create({
//         baseURL: userData.selectedApiUrl,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     })
// }

// export const getAllPOByProduct = async (productCode) => {
//   try {
//     if (!productCode) throw new Error('Product code is required');

//     const api = createApiInstance();

//     // Debug: Log the request details
//     console.log('🔍 API Request Details:');
//     console.log('- Base URL:', api.defaults.baseURL);
//     console.log('- Endpoint:', ALLPOBYPRO_ENDPOINT);
//     console.log('- Full URL:', `${api.defaults.baseURL}${ALLPOBYPRO_ENDPOINT}`);
//     console.log('- Product Code:', productCode);
//     console.log('- Headers:', api.defaults.headers);

//     const response = await api.request({
//       method: 'GET',
//       url: ALLPOBYPRO_ENDPOINT,
//       data: JSON.stringify({
//         ProductCode: productCode
//       }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('✅ API Response:', response.data);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error('❌ Error fetching PO by product:', error);
//     console.error('❌ Error response:', error.response);
//     console.error('❌ Error config:', error.config);

//     // Check if response is HTML (server error page)
//     if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
//       console.error('❌ Server returned HTML error page instead of JSON');
//       return {
//         success: false,
//         error: `Server Error (${error.response.status}): Server returned HTML error page. Please check server logs.`
//       };
//     }

//     // Handle different error types
//     let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล PO';

//     if (error.response) {
//       // Server responded with error status
//       const status = error.response.status;
//       const statusText = error.response.statusText;

//       if (status === 500) {
//         errorMessage = `Server Internal Error (500): ${statusText}. Please contact administrator.`;
//       } else if (status === 404) {
//         errorMessage = `API Endpoint Not Found (404): ${statusText}`;
//       } else if (status === 401) {
//         errorMessage = `Unauthorized (401): Please check your authentication token`;
//       } else if (status === 403) {
//         errorMessage = `Forbidden (403): You don't have permission to access this resource`;
//       } else {
//         errorMessage = `HTTP Error (${status}): ${statusText}`;
//       }
//     } else if (error.request) {
//       // Request was made but no response received
//       errorMessage = 'Network Error: No response from server. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || 'Unknown error occurred';
//     }

//     return {
//       success: false,
//       error: errorMessage
//     };
//   }
// };

import { getStoredUserData, getAuthToken } from "@/lib/auth";

const ALLPOBYPRO_ENDPOINT =
  process.env.ALLPOBYPRO_ENDPOINT || "/api/po/allPObyProduct";

export const getAllPOByProduct = async (productCode) => {
  try {
    if (!productCode) throw new Error("Product code is required");

    const userData = getStoredUserData();
    const token = getAuthToken();

    if (!userData || !token) throw new Error("User not authenticated");

    const url = `${userData.selectedApiUrl}${ALLPOBYPRO_ENDPOINT}`;

    console.log("🔍 API Request Details:");
    console.log("- URL:", url);
    console.log("- Product Code:", productCode);
    console.log("- Token:", token);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ProductCode: productCode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    return { success: true, data };
  } catch (error) {
    console.error("❌ Error fetching PO by product:", error);

    return {
      success: false,
      error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล PO",
    };
  }
};
