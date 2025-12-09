import { NextResponse } from "next/server";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error searching city:", error);
    return NextResponse.json({ message: "Failed to search city" }, { status: 500 });
  }
}
