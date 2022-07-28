import { Children, Component, ComponentType, isValidElement, ReactElement } from 'react';

export interface ErrorBoundaryProps {
  fallback?: ComponentType<{ error: Error }> | ReactElement | null;
}

interface State {
  error: Error | null;
}

/**
 * Stop errors in some components from breaking the whole app.
 *
 * > A JavaScript error in a part of the UI shouldn’t break the whole app.
 * > To solve this problem for React users, React 16 introduces a new concept
 * > of an “error boundary”.
 *
 * @see https://reactjs.org/docs/error-boundaries.html
 *
 * @example
 * ```tsx
 * <ErrorBoundary><p>this might fail</p></ErrorBoundary>
 *
 * <ErrorBoundary
 *   key={someName}
 *   fallback={({error}) => {
 *     return <div>An error has occurred: {error}</div>;
 *   }}
 * >
 *   <p>a component that might fail</p>
 * </ErrorBoundary>
 *
 * <ErrorBoundary fallback={<p>a fallback</p>}><p>this might fail</p></ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error | null) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    if (isValidElement(this.props.fallback)) {
      return this.props.fallback;
    }
    return this.props.fallback ? Children.toArray([<this.props.fallback error={error} />]) : null;
  }
}
