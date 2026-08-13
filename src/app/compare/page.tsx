import { redirect } from "next/navigation";

export default function CompareRootPage() {
  // Mặc định chuyển hướng sang cặp so sánh hot ở Anh: London (SW1A 1) vs Manchester (M1 1)
  redirect("/compare/sw1a-1-vs-m1-1");
}