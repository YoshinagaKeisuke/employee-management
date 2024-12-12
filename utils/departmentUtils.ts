import { Department } from "../types/department";

/**
 * 指定された部署IDの親部署を特定する関数
 * @param departmentId 親部署を特定したい部署のID
 * @param allDepartments 全部署データの配列
 * @returns 親部署、または親部署が存在しない場合はnull
 */
export function findParentDepartment(
  departmentId: string,
  allDepartments: Department[]
): Department | null {
  const department = allDepartments.find((dept) => dept.id === departmentId);
  if (!department || department.parentId === null) {
    return null;
  }
  return allDepartments.find((dept) => dept.id === department.parentId) || null;
}
