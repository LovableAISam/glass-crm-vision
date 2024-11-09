import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewKYCRequestTab from '../components/ViewKYCRequest/ViewKYCRequestTab';

const mockPropsCreate = {
  activeTab: 0,
  kycDetail: null,
  memberDetail: null,
};

describe('ViewKYCRequestTab component', () => {
  it('renders component with activeTab 0', () => {
    const { unmount } = render(<ViewKYCRequestTab {...mockPropsCreate} />);

    unmount();
  });

  it('renders component with activeTab 1', () => {
    const { unmount } = render(
      <ViewKYCRequestTab {...mockPropsCreate} activeTab={1} />,
    );

    unmount();
  });

  it('renders component with activeTab 2', () => {
    const { unmount } = render(
      <ViewKYCRequestTab {...mockPropsCreate} activeTab={2} />,
    );

    unmount();
  });

  it('renders component with default null', () => {
    const { unmount } = render(
      <ViewKYCRequestTab {...mockPropsCreate} activeTab={3} />,
    );

    unmount();
  });
});
