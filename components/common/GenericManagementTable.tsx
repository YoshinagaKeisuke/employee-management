import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ColorPicker";
import {
  ManagementItem,
  ManagementItemType,
  DepartmentManagementItem,
} from "../../types/management";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GenericManagementTableProps<T extends ManagementItem> {
  type: ManagementItemType;
  items: T[];
  onAdd: (item: Omit<T, "id">) => Promise<void>;
  onUpdate: (id: string, item: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  getParentOptions?: () => T[];
  renderAdditionalFields?: (
    item: T,
    isEditing: boolean,
    onChange: (field: keyof T, value: T[keyof T]) => void
  ) => React.ReactNode;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  onBulkUpdate: (items: Partial<T>[]) => Promise<void>;
}

export const GenericManagementTable = React.memo(
  <T extends ManagementItem>({
    type,
    items,
    onAdd,
    onUpdate,
    onDelete,
    getParentOptions,
    renderAdditionalFields,
    setItems,
    onBulkUpdate,
  }: GenericManagementTableProps<T>) => {
    const { toast } = useToast();
    const [newItem, setNewItem] = useState<Omit<T, "id">>({
      name: "",
      order: 0,
    } as Omit<T, "id">);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const handleAdd = async () => {
      if (newItem && newItem.name && newItem.name.trim()) {
        try {
          const maxOrder = Math.max(...items.map((item) => item.order), 0);
          const itemToAdd = {
            ...newItem,
            order: maxOrder + 1,
          } as Omit<T, "id">;

          if (type === "departments") {
            (itemToAdd as Partial<DepartmentManagementItem>).parentId =
              (newItem as Partial<DepartmentManagementItem>).parentId === "none"
                ? null
                : (newItem as Partial<DepartmentManagementItem>).parentId ||
                  null;
          }

          await onAdd(itemToAdd);
          setNewItem({ name: "", order: 0 } as Omit<T, "id">);
        } catch (error) {
          console.error("Failed to add item:", error);
          toast({
            title: "エラー",
            description: "アイテムの追加に失敗しました。",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "エラー",
          description: "名前を入力してください。",
          variant: "destructive",
        });
      }
    };

    const handleUpdate = async () => {
      if (editingItem && editingItem.name.trim()) {
        try {
          const updatedItem = {
            ...editingItem,
            parentId:
              type === "departments" &&
              (editingItem as DepartmentManagementItem).parentId === "none"
                ? null
                : (editingItem as DepartmentManagementItem).parentId,
          };
          await onUpdate(editingItem.id, updatedItem);
          setEditingItem(null);
          toast({
            title: "更新成功",
            description: "アイテムが正常に更新されました。",
          });
        } catch (error) {
          console.error("Failed to update item:", error);
          toast({
            title: "エラー",
            description: `アイテムの更新に失敗しました: ${
              error instanceof Error ? error.message : "不明なエラー"
            }`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "エラー",
          description: "名前は空にできません。",
          variant: "destructive",
        });
      }
    };

    const handleDelete = async (id: string) => {
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Failed to delete item:", error);
        toast({
          title: "エラー",
          description: "アイテムの削除に失敗しました。",
          variant: "destructive",
        });
      }
    };

    const onDragEnd = useCallback(
      async (result: DropResult) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        setItems(updatedItems);

        try {
          await onBulkUpdate(updatedItems);
        } catch (error) {
          console.error(`Failed to update order:`, error);
          toast({
            title: "エラー",
            description: "順序の更新に失敗しました。",
            variant: "destructive",
          });
        }
      },
      [items, onBulkUpdate, setItems, toast]
    );

    const renderNewItemFields = () => (
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder={`新しい${
            type === "locations"
              ? "拠点"
              : type === "positions"
              ? "役職"
              : "部署"
          }名`}
          value={newItem.name}
          onChange={(e) =>
            setNewItem({ ...newItem, name: e.target.value } as Omit<T, "id">)
          }
        />
        {type === "departments" && (
          <>
            <Select
              value={
                (newItem as Partial<DepartmentManagementItem>).parentId ||
                "none"
              }
              onValueChange={(value) =>
                setNewItem({
                  ...newItem,
                  parentId: value === "none" ? null : value,
                } as Omit<T, "id">)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="親部署を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">親部署なし</SelectItem>
                {getParentOptions &&
                  getParentOptions().map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <ColorPicker
              color={
                (newItem as Partial<DepartmentManagementItem>).color || null
              }
              onChange={(color) =>
                setNewItem({ ...newItem, color } as Omit<T, "id">)
              }
            />
          </>
        )}
        {renderAdditionalFields &&
          renderAdditionalFields(newItem as T, true, (field, value) =>
            setNewItem({ ...newItem, [field]: value } as Omit<T, "id">)
          )}
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> 追加
        </Button>
      </div>
    );

    return (
      <div className="space-y-4">
        {renderNewItemFields()}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={type} direction="vertical">
            {(droppableProvided: DroppableProvided) => (
              <div
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                className="flex flex-col space-y-2"
              >
                <div className="flex font-bold bg-gray-100 p-2 rounded">
                  <div className="w-8"></div>
                  <div className="flex-1">
                    {type === "locations"
                      ? "拠点"
                      : type === "positions"
                      ? "役職"
                      : "部署"}
                    名
                  </div>
                  {type === "departments" && (
                    <>
                      <div className="flex-1">親部署</div>
                      <div className="w-20">色</div>
                    </>
                  )}
                  {renderAdditionalFields && (
                    <div className="flex-1">追加フィールド</div>
                  )}
                  <div className="w-24 text-right">操作</div>
                </div>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided: DraggableProvided, snapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className={cn(
                          "flex items-center p-2 rounded",
                          snapshot.isDragging
                            ? "bg-accent shadow-lg"
                            : "bg-white",
                          "hover:bg-accent transition-colors"
                        )}
                      >
                        <div
                          {...draggableProvided.dragHandleProps}
                          className="w-8 cursor-move"
                        >
                          <GripVertical
                            className="h-4 w-4 text-muted-foreground"
                            aria-label="ドラッグハンドル"
                          />
                        </div>
                        <div className="flex-1">
                          {editingItem?.id === item.id ? (
                            <Input
                              value={editingItem.name}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            item.name
                          )}
                        </div>
                        {type === "departments" && (
                          <>
                            <div className="flex-1">
                              {editingItem?.id === item.id ? (
                                <Select
                                  value={
                                    (editingItem as DepartmentManagementItem)
                                      .parentId || "none"
                                  }
                                  onValueChange={(value) =>
                                    setEditingItem({
                                      ...editingItem,
                                      parentId: value === "none" ? null : value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="親部署を選択" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      親部署なし
                                    </SelectItem>
                                    {getParentOptions &&
                                      getParentOptions()
                                        .filter((d) => d.id !== item.id)
                                        .map((dept) => (
                                          <SelectItem
                                            key={dept.id}
                                            value={dept.id}
                                          >
                                            {dept.name}
                                          </SelectItem>
                                        ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                (getParentOptions &&
                                  getParentOptions().find(
                                    (d) =>
                                      d.id ===
                                      (item as DepartmentManagementItem)
                                        .parentId
                                  )?.name) ||
                                "親部署なし"
                              )}
                            </div>
                            <div className="w-20">
                              {editingItem?.id === item.id ? (
                                <ColorPicker
                                  color={
                                    (editingItem as DepartmentManagementItem)
                                      .color ?? null
                                  }
                                  onChange={(color) =>
                                    setEditingItem({ ...editingItem, color })
                                  }
                                />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-full"
                                  style={{
                                    backgroundColor:
                                      (item as DepartmentManagementItem)
                                        .color || "transparent",
                                  }}
                                />
                              )}
                            </div>
                          </>
                        )}
                        {renderAdditionalFields && (
                          <div className="flex-1">
                            {editingItem?.id === item.id
                              ? renderAdditionalFields(
                                  editingItem,
                                  true,
                                  (field, value) =>
                                    setEditingItem({
                                      ...editingItem,
                                      [field]: value,
                                    })
                                )
                              : renderAdditionalFields(item, false, () => {})}
                          </div>
                        )}
                        <div className="w-24 text-right">
                          {editingItem?.id === item.id ? (
                            <Button onClick={handleUpdate}>更新</Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingItem(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
);

GenericManagementTable.displayName = "GenericManagementTable";
