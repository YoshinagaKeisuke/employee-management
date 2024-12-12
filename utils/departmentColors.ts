import { Department } from "../types/department";
import { findParentDepartment } from "./departmentUtils";

const DEFAULT_COLOR = "#E5E7EB"; // デフォルトの色（ライトグレー）

export const getDepartmentColor = (
  department: Department,
  allDepartments: Department[]
): string => {
  // 部署自体に色が指定されている場合はそれを使用
  if (department.color) {
    return applyOpacity(department.color);
  }

  // 親部署を特定
  const parentDepartment = findParentDepartment(department.id, allDepartments);

  // 親部署の色を使用（存在する場合）
  if (parentDepartment && parentDepartment.color) {
    return applyOpacity(parentDepartment.color);
  }

  // どちらもない場合はデフォルトの色を返す
  return applyOpacity(DEFAULT_COLOR);
};

function applyOpacity(color: string): string {
  const opacity = "0.2";
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

// ヘックスカラーをRGBに変換するヘルパー関数
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0, 0, 0"; // デフォルトは黒
}
