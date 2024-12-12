import { Department } from "../types/department";

export const mockDepartments: Department[] = [
  { id: "1", name: "経営部", parentId: null, color: "#3B82F6", order: 1 }, // blue-500
  { id: "2", name: "経理部", parentId: null, order: 2 }, // 色の指定なし
  { id: "3", name: "人事部", parentId: null, color: "#F59E0B", order: 3 }, // yellow-500
  { id: "4", name: "営業部", parentId: null, color: "#8B5CF6", order: 4 }, // purple-500
  { id: "5", name: "営業1課", parentId: "4", order: 5 }, // 親部署と同じ色
  { id: "6", name: "営業2課", parentId: "4", color: "#10B981", order: 6 }, // 独自の色 (green-500)
  { id: "7", name: "技術開発部", parentId: null, color: "#EC4899", order: 7 }, // pink-500
  { id: "8", name: "フロントエンド開発課", parentId: "7", order: 8 }, // 親部署と同じ色
  { id: "9", name: "バックエンド開発課", parentId: "7", order: 9 }, // 親部署と同じ色
];
