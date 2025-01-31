import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewManageMemberTab from '../components/ViewManageMamber/ViewManageMemberTab';

const mockPropsCreate = {
  activeTab: 0,
  memberDetail: null,
  memberKYCDetail: null,
};

describe('ViewManageMemberTab component', () => {
  it('renders component with activeTab 0', () => {
    const { unmount } = render(<ViewManageMemberTab {...mockPropsCreate} />);

    unmount();
  });

  it('renders component with activeTab 1', () => {
    const { unmount } = render(
      <ViewManageMemberTab {...mockPropsCreate} activeTab={1} />,
    );

    unmount();
  });

  it('renders component with default null', () => {
    const { unmount } = render(
      <ViewManageMemberTab {...mockPropsCreate} activeTab={2} />,
    );

    unmount();
  });
});
