import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (token !== ACCESS_TOKEN) {
      return NextResponse.json({ error: "无效的访问令牌" }, { status: 401 });
    }

    // 创建响应对象
    const response = NextResponse.json({ success: true }, { status: 200 });

    // 设置两个cookie：一个用于API访问，一个用于前端读取
    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true, // 用于API请求验证
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set({
      name: "access_token_client",
      value: token,
      httpOnly: false, // 允许前端JavaScript读取
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token验证失败:", error);
    return NextResponse.json({ error: "验证失败" }, { status: 500 });
  }
}
