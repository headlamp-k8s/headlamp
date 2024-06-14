import { render, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';

// todo: enable this after https://github.com/vitest-dev/vitest/issues/4143 is fixed
test.skip('renders without crashing', async () => {
  const { getByText } = render(
    <React.Suspense fallback="Loading...">
      <App />
    </React.Suspense>
  );
  await waitFor(() => {
    expect(getByText(/Skip to main content/i)).toBeInTheDocument();
  });
});
