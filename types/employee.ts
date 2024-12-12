/**
 * @file types/employee.ts
 * @description 従業員データの型定義を提供します。
 * このファイルは従業員の各属性の型を定義し、アプリケーション全体で一貫した
 * データ構造を確保するために使用されます。
 */

/**
 * Employee インターフェース
 * 従業員の詳細情報を表現します。
 */
export interface Employee {
  id: string; // 従業員の一意識別子
  lastName: string; // 姓
  firstName: string; // 名
  lastNameKana: string; // 姓（カナ）
  firstNameKana: string; // 名（カナ）
  email: string; // メールアドレス
  gender: "男性" | "女性" | "その他"; // 性別
  birthDate: string | null; // 生年月日
  phoneNumber: string; // 電話番号
  introduction: string; // 自己紹介
  imageUrl: string; // プロフィール画像のURL
  department: string | null; // 所属部署のID
  location: string | null; // 勤務地のID
  position: string | null; // 役職のID
  employeeNumber: string; // 従業員番号
  hireDate: string; // 入社日
  createdAt: string; // レコード作成日時
  updatedAt: string; // レコード更新日時
  order: number; // 表示順序
}
