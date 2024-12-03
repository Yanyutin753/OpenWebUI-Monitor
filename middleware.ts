import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_KEY = process.env.API_KEY;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 请求验证
  if (
    pathname.startsWith("/api/v1/inlet") ||
    pathname.startsWith("/api/v1/outlet") ||
    pathname.startsWith("/api/v1/models/test")
  ) {
    if (!API_KEY) {
      console.error("未设置 API_KEY 环境变量");
      return NextResponse.json({ error: "服务器配置错误" }, { status: 500 });
    }

    const authHeader = request.headers.get("authorization");
    const providedKey = authHeader?.replace("Bearer ", "");

    if (!providedKey || providedKey !== API_KEY) {
      console.log("API密钥无效");
      return NextResponse.json({ error: "无效的API密钥" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // 页面访问验证
  if (!pathname.startsWith("/api/") && pathname !== "/token") {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      // 重定向到token页面
      return NextResponse.redirect(new URL("/token", request.url));
    }

    // 验证access token是否有效
    if (accessToken !== ACCESS_TOKEN) {
      // 清除token并重定向到token页面
      const response = NextResponse.redirect(new URL("/token", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  // 添加缓存控制头
  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
