import { Department } from "./department";
import { Location } from "./location";
import { Position } from "./position";

export type DepartmentManagementItem = Department;
export type LocationManagementItem = Location;
export type PositionManagementItem = Position;

export type ManagementItem =
  | DepartmentManagementItem
  | LocationManagementItem
  | PositionManagementItem;

export type ManagementItemType = "departments" | "locations" | "positions";

export interface ManagementProps<T extends ManagementItem> {
  type: ManagementItemType;
  items: T[];
  onAdd: (item: Omit<T, "id">) => Promise<void>;
  onUpdate: (id: string, item: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  getParentOptions?: () => T[];
}

export type ApiFunction<T> = (...args: unknown[]) => Promise<T>;

export interface UseManagementDataProps<T extends ManagementItem> {
  fetchItems: ApiFunction<T[]>;
  createItem: ApiFunction<T>;
  updateItem: ApiFunction<T>;
  deleteItem: ApiFunction<void>;
  type: ManagementItemType;
}
