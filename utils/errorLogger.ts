export function logError(...args: any[]) {
  console.error(...args);
  // ここに、サーバーへのエラーログ送信ロジックを追加することができます
  // 例: sendErrorToServer(args);
}
