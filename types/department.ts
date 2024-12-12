/**
 * @file types/department.ts
 * @description 部署データの型定義を提供します。
 * このファイルは部署の各属性の型を定義し、アプリケーション全体で一貫した
 * データ構造を確保するために使用されます。
 */

/**
 * Department インターフェース
 * 部署の詳細情報を表現します。
 */
export interface Department {
  id: string; // 部署の一意識別子
  name: string; // 部署名
  parentId: string | null; // 親部署のID（トップレベルの部署の場合はnull）
  color?: string; // 部署を表す色（オプション）
  order: number; // 表示順序
}
