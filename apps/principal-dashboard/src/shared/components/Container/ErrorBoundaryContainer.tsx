// Core
import React, { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Hooks & Utils
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

// Components
import GeneralErrorPage from '../Error/GeneralErrorPage';

function ErrorBoundaryContainer(props: PropsWithChildren<{}>) {
  const { children } = props;

  const { reset } = useQueryErrorResetBoundary();

  return (
    // @ts-ignore
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => {
        const onRetry = () => {
          if (typeof error === 'function') {
            (error as any)();
          }
          resetErrorBoundary();
        };
        return <GeneralErrorPage onRetry={onRetry} />;
      }}
      onError={(error) => {
        console.error(error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundaryContainer;