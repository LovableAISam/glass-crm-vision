import React from 'react';
import { render } from '@testing-library/react';
import PersonalData from '../components/ViewManageMamber/content/PersonalData';

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

const mockMemberKycDetail = {
  addressId: '987654',
  barangay: 'Sample Barangay',
  city: 'Sample City',
  cityOfBirth: 'Sample City',
  countryOfBirth: 'Birth Country',
  countryOfResidence: 'Sample Country',
  dateOfBirth: '1990-01-01',
  employer: 'Sample Employer',
  gender: 'Male',
  idNumber: 'ID123456',
  industryId: '789012',
  jobTitle: 'Sample Job Title',
  motherMaidenName: 'Sample Mother Maiden Name',
  name: 'Sample Name',
  province: 'Sample Province',
  referralCode: 'REF123',
  residenceAddressId: '123456',
  sourceOfIncome: 'Sample Income Source',
  streetAddress: 'Sample Street Address',
  townDistrictBirth: 'Sample Town',
  zipCode: '12345',
  id: '12345',
  createdDate: '2023-01-01',
  modifiedDate: '2023-01-01',
};

const renderPage = () => {
  return render(
    <PersonalData
      activeTab={0}
      memberDetail={null}
      memberKYCDetail={mockMemberKycDetail}
    />,
  );
};

describe('page personal data', () => {
  test('success render detail data', () => {
    const { getByText, unmount } = renderPage();

    const pageTitle = getByText('personalDataIdentityDetails');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('personalDataGender')).toBeInTheDocument();
    expect(getByText('Male')).toBeInTheDocument();

    expect(getByText('personalDataMotherMaidenName')).toBeInTheDocument();
    expect(getByText('Sample Mother Maiden Name')).toBeInTheDocument();

    expect(getByText('personalDataCountryofBirth')).toBeInTheDocument();
    expect(getByText('Birth Country')).toBeInTheDocument();

    unmount();
  });
});
