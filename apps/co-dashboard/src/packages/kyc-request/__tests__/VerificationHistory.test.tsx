import React from 'react';
import { render } from '@testing-library/react';
import VerificationHistory from '../components/ViewKYCRequest/content/VerificationHistory';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      coName: 'co',
    },
    push: jest.fn(),
    route: '',
    components: {},
    isFallback: false,
    basePath: '',
    locale: 'en',
    locales: ['en', 'id'],
    defaultLocale: 'en',
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    events: {},
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

const renderPage = () => {
  return render(<VerificationHistory />);
};

describe('page account information', () => {
  test('renders a loading state', () => {
    const { getByText, unmount } = renderPage();

    expect(
      getByText('verificationHistoryTableHeaderVerifierName'),
    ).toBeInTheDocument();
    expect(
      getByText('verificationHistoryTableHeaderStatusGiven'),
    ).toBeInTheDocument();
    expect(
      getByText('verificationHistoryTableHeaderComments'),
    ).toBeInTheDocument();

    // const buttonSeeTrx = getByText(
    //   'accountInformationActionSeeTransactionDetail',
    // );
    // expect(buttonSeeTrx).toBeInTheDocument();
    // fireEvent.click(buttonSeeTrx);

    unmount();
  });
});
