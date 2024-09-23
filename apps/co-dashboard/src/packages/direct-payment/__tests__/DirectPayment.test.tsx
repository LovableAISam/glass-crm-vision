import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DirectPayment from '../DirectPayment';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

jest.mock('mui-one-time-password-input', () => {
  const MuiOtpInput = jest.fn(() => <div data-testid="mocked-otp-input"></div>);

  return { MuiOtpInput };
});

const renderPage = () => {
  return render(<DirectPayment />);
};

describe('Dashboard', () => {
  test('should render successfully', async () => {
    const { unmount } = renderPage();

    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    unmount();
  });

  test('show modal forgot pin info', async () => {
    const { unmount } = renderPage();

    const buttonForgot = screen.getByText('Forgot PIN?');
    expect(buttonForgot).toBeInTheDocument();

    fireEvent.click(buttonForgot);

    expect(
      screen.getByText(`Please change your PIN using WOI App`),
    ).toBeInTheDocument();

    unmount();
  });

  test('success input data', async () => {
    const { unmount } = render(<DirectPayment />);

    const inputPhoneNumber = screen.getByPlaceholderText(
      'Enter your WOI phone no',
    );
    const inputPIN = screen.getByPlaceholderText('Enter your WOI PIN');

    fireEvent.change(inputPhoneNumber, { target: { value: '0852' } });
    fireEvent.change(inputPIN, { target: { value: '123456' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
    });

    expect(screen.getByText(`Input OTP`)).toBeInTheDocument();

    const resend = screen.getByText('Resend OTP');
    expect(resend).toBeInTheDocument();
    fireEvent.click(resend);
    expect(screen.getByText(`Resend OTP Success`)).toBeInTheDocument();

    const continuePayment = screen.getByText('Continue to Payment');
    fireEvent.click(continuePayment);
    expect(screen.getByText(`Payment successful!`)).toBeInTheDocument();

    unmount();
  });
});
