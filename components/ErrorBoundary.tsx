import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logError } from "../utils/errorLogger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                エラーが発生しました
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                申し訳ありませんが、予期せぬエラーが発生しました。問題が解決しない場合は、管理者にお問い合わせください。
              </p>
              {this.state.error && (
                <p className="mt-2 text-sm text-gray-500">
                  エラー詳細: {this.state.error.message}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()} className="w-full">
                ページをリロード
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

