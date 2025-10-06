import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productCode } = body;

    if (!productCode) {
      return new Response(
        JSON.stringify({ success: false, error: "Product code is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userDataCookie = cookieStore.get("userData")?.value;

    if (!token || !userDataCookie) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse userData จาก cookie
    let userData;
    try {
      userData = JSON.parse(decodeURIComponent(userDataCookie));
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid user data" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // สร้าง URL สำหรับ API endpoint
    const ALLPOBYPRO_ENDPOINT = "/api/po/allPObyProduct";
    const BACKEND_URL = `${userData.selectedApiUrl}${ALLPOBYPRO_ENDPOINT}`;

    // console.log("🔹 Sending request to backend:");
    // console.log("- URL:", BACKEND_URL);
    // console.log("- ProductCode:", productCode);
    // console.log("- Token:", token);

    // ส่ง request แบบ GET + JSON body (axios support)
    const response = await axios({
      method: "GET",
      url: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { ProductCode: productCode },
      validateStatus: () => true, // ป้องกัน axios throw error อัตโนมัติ
    });

    // console.log("✅ Backend response status:", response.status);
    // console.log("✅ Backend response data:", response.data);

    if (response.status >= 400) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Backend Error (${response.status})`,
          data: response.data,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: response.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // console.error("❌ Proxy Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown proxy error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
