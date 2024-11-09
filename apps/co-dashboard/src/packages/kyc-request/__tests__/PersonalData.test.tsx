import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import PersonalData from '../components/ViewKYCRequest/content/PersonalData';
import { KycPremiumMemberDetailForm } from '../hooks/useKycRequstUpsert';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

jest.mock('@src/shared/components/FormUpload/ImageUpload', () => {
  return jest.fn(props => {
    return (
      <div>
        <button onClick={() => props.onView(null)}>View Image</button>
      </div>
    );
  });
});

const mockKycPremiumMemberDetail: KycPremiumMemberDetailForm = {
  identityCard: {
    id: 1,
    docPath: '/path/to/identityCard',
    fileData: new File([], 'identityCard.jpg'),
    imageUri: '/path/to/identityCardImage',
    fileName: 'identityCard.jpg',
  },
  selfie: {
    id: 2,
    docPath: '/path/to/selfie',
    fileData: new File([], 'selfie.jpg'),
    imageUri: '/path/to/selfieImage',
    fileName: 'selfie.jpg',
  },
  signature: {
    id: 3,
    docPath: '/path/to/signature',
    fileData: new File([], 'signature.jpg'),
    imageUri: '/path/to/signatureImage',
    fileName: 'signature.jpg',
  },
  id: '1234567890',
  createdDate: '2023-11-23',
  modifiedDate: '2023-11-23',
  address: '123 Main Street',
  city: null,
  dateOfBirth: '1990-01-01',
  fullName: 'John Doe',
  gender: 'Male',
  isDttot: true,
  identityCardUrl: '/path/to/identityCardUrl',
  identityNumber: 987654321,
  identityType: 'Passport',
  email: 'john.doe@example.com',
  occupation: null,
  phoneNumber: '1234567890',
  placeOfBirth: 'Cityville',
  province: null,
  selfieUrl: '/path/to/selfieUrl',
  signatureUrl: '/path/to/signatureUrl',
  status: null,
  zipCode: 12345,
};

const renderPage = () => {
  return render(
    <PersonalData
      activeTab={0}
      memberDetail={null}
      kycDetail={mockKycPremiumMemberDetail}
    />,
  );
};

describe('page personal data', () => {
  test('renders a loading state', () => {
    const { getByText, unmount } = renderPage();

    const pageTitle = getByText('personalDataTitle');
    expect(pageTitle).toBeInTheDocument();

    unmount();
  });

  test('handle upload image id card', () => {
    const { getByText, getAllByText, unmount } = renderPage();

    expect(getByText('personalDataIDCard')).toBeInTheDocument();
    const viewButton = getAllByText('View Image');

    fireEvent.click(viewButton[0]);

    unmount();
  });

  test('handle upload image selfie with ktp', () => {
    const { getByText, getAllByText, unmount } = renderPage();

    expect(getByText('personalDataSelfieWithKTP')).toBeInTheDocument();
    const viewButton = getAllByText('View Image');

    fireEvent.click(viewButton[1]);

    unmount();
  });

  test('handle upload image signature', () => {
    const { getByText, getAllByText, unmount } = renderPage();

    expect(getByText('personalDataSignature')).toBeInTheDocument();
    const viewButton = getAllByText('View Image');

    fireEvent.click(viewButton[2]);

    unmount();
  });
});
