export const errorMessages = {
  addEmployee: "従業員の追加中にエラーが発生しました。",
  updateEmployee: "従業員の更新中にエラーが発生しました。",
  deleteEmployee: "従業員の削除中にエラーが発生しました。",
  fetchEmployees: "従業員データの取得中にエラーが発生しました。",
  invalidEmail: "無効なメールアドレスです。",
  requiredField: (field: string) => `${field}は必須項目です。`,
  networkError:
    "ネットワークエラーが発生しました。インターネット接続を確認してください。",
  unexpectedError: "予期せぬエラーが発生しました。もう一度お試しください。",
};
