import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ManagementItem, ManagementItemType } from "../types/management";
import {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
} from "../utils/indexedDB";

export function useManagementData<T extends ManagementItem>(
  type: ManagementItemType
) {
  const [items, setItems] = useState<T[]>([]);
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    try {
      const fetchedItems = await getAllItems<T>(type);
      setItems(fetchedItems.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast({
        title: "エラー",
        description: `${type}情報の取得に失敗しました。`,
        variant: "destructive",
      });
    }
  }, [type, toast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = useCallback(
    async (newItem: Omit<T, "id">) => {
      try {
        const maxOrder = Math.max(...items.map((item) => item.order), 0);
        const itemToAdd = {
          ...newItem,
          id: Date.now().toString(),
          order: maxOrder + 1,
        } as T;
        await addItem(type, itemToAdd);
        setItems((prevItems) => [...prevItems, itemToAdd]);
        toast({
          title: "成功",
          description: `新しい${type}が追加されました。`,
        });
      } catch (error) {
        console.error(`Error adding ${type}:`, error);
        toast({
          title: "エラー",
          description:
            error instanceof Error
              ? error.message
              : `${type}の追加に失敗しました。`,
          variant: "destructive",
        });
      }
    },
    [items, type, toast]
  );

  const handleUpdate = useCallback(
    async (id: string, updatedItem: Partial<T>) => {
      try {
        const existingItems = await getAllItems<T>(type);
        const itemToUpdate = existingItems.find((item) => item.id === id);
        if (!itemToUpdate) {
          throw new Error(`${type} not found`);
        }
        const updated = {
          ...itemToUpdate,
          ...updatedItem,
          order: updatedItem.order ?? itemToUpdate.order,
        };
        await updateItem(type, updated);
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updated : item))
        );
        toast({
          title: "成功",
          description: `${type}情報が更新されました。`,
        });
      } catch (error) {
        console.error(`Error updating ${type}:`, error);
        toast({
          title: "エラー",
          description:
            error instanceof Error
              ? error.message
              : `${type}の更新に失敗しました。`,
          variant: "destructive",
        });
        throw error; // Re-throw the error to be caught by the caller
      }
    },
    [type, toast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteItem(type, id);
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast({
          title: "成功",
          description: `${type}が削除されました。`,
        });
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        toast({
          title: "エラー",
          description:
            error instanceof Error
              ? error.message
              : `${type}の削除に失敗しました。`,
          variant: "destructive",
        });
      }
    },
    [type, toast]
  );

  const handleBulkUpdate = useCallback(
    async (updatedItems: Partial<T>[]) => {
      try {
        for (const item of updatedItems) {
          if (item.id) {
            await updateItem(type, item as T);
          }
        }

        setItems((prevItems) => {
          const updatedItemMap = new Map(
            updatedItems.map((item) => [item.id, item])
          );
          return prevItems.map((item) => {
            const update = updatedItemMap.get(item.id);
            return update ? { ...item, ...update } : item;
          });
        });

        toast({
          title: "成功",
          description: `${type}の順序が更新されました。`,
        });
      } catch (error) {
        console.error(`Error bulk updating ${type}:`, error);
        toast({
          title: "エラー",
          description:
            error instanceof Error
              ? error.message
              : `${type}の一括更新に失敗しました。`,
          variant: "destructive",
        });
      }
    },
    [type, toast]
  );

  const refreshItems = useCallback(async () => {
    await loadItems();
  }, [loadItems]);

  return {
    items,
    setItems,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
    refreshItems,
  };
}
