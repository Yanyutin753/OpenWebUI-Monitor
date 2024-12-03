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

    // 设置会话cookie
    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
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
