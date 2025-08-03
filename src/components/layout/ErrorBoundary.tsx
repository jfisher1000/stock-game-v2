// src/components/layout/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // This lifecycle method is invoked after an error has been thrown by a descendant component.
  // It receives the error that was thrown as a parameter and should return a value to update state.
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // This lifecycle method is also called after an error has been thrown by a descendant component.
  // It's a good place to log the error to an external service.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // In a production environment, you would log this to a service like Sentry, LogRocket, etc.
    // logErrorToMyService(error, errorInfo);
  }

  // Reloads the page to attempt a fresh start.
  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-destructive mb-4">Oops!</h1>
            <h2 className="text-2xl font-semibold mb-2">Something went wrong.</h2>
            <p className="text-muted-foreground mb-6">
              We've encountered an unexpected error. Please try reloading the page.
            </p>
            <Button onClick={this.handleReload}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
