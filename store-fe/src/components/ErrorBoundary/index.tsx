import React from "react";
import CrashPage from "../../containers/Error/Crash";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled Error:", error, info);
    // You could log to a service here like Sentry
  }

  render() {
    if (this.state.hasError) {
      return <CrashPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
