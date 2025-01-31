import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfirmationDialogProvider } from '@woi/web-component';
import ViewManageMemberModal from '../components/ViewManageMemberModal';

const queryCache = new QueryCache();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
  queryCache,
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      coName: 'co',
    },
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

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(() => ({
    reset: jest.fn(),
    watch: jest.fn(() => ({
      multipleContent: [{ description: '' }],
      contentName: false,
    })),
    control: jest.fn(),
    setValue: jest.fn(),
    register: jest.fn(),
    getValues: jest.fn(() => 'hai'),
    handleSubmit: jest.fn(
      (onSubmit: (data: any) => void) => (e: any) => onSubmit(e),
    ),
    formState: { errors: jest.fn() },
  })),
  useFieldArray: jest.fn(() => ({
    fields: [{ title: 'title' }],
    append: jest.fn(),
    remove: jest.fn(),
  })),
  useController: jest.fn(() => ({
    fields: [{ fieldSubject: 'title' }],
  })),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useConfirmationDialog: jest.fn(() => ({
    getConfirmation: new Promise(() => true),
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
  })),
}));

jest.mock('@src/shared/components/AuthorizeView/AuthorizeView', () => {
  const mockAuthorizeView: jest.Mock = jest.fn(({ children }) => (
    <div>{children}</div>
  ));

  return {
    __esModule: true,
    default: mockAuthorizeView as React.FC<{ children: React.ReactNode }>,
    mockAuthorizeView,
  };
});

jest.mock('../components/ViewManageMamber/ViewManageMemberTab', () =>
  jest.fn(({ children }) => <div>{children}</div>),
);

const moockMemberDetail = {
  id: '123456',
  createdDate: '2023-01-01',
  modifiedDate: '2023-01-01',
  email: 'dummy@example.com',
  name: 'Dummy User',
  username: 'dummyuser',
  phoneNumber: '1234567890',
  rmNumber: 'RM123456',
  vybeMember: 'LITE',
  upgradeStatus: 'NOT_UPGRADE',
  activationStatus: 'LOCK',
  loyaltyStatus: 'REGISTERED',
  isEnable: true,
  isAccountNonLocked: true,
  isCredentialsNonExpired: true,
  isTemporaryPassword: false,
  createdBy: 'admin',
  pictureFileName: 'dummy.jpg',
  accountNumber: '987654321',
  dateOfBirth: '1990-01-01',
  upgradeDate: '2023-02-01',
  secretId: 'abcdef123456',
  gcmId: 'gcm-123456789',
  balance: 100.5,
  isAccountNonExpired: true,
};

const mockMemberKycDetail = {
  addressId: '987654',
  barangay: 'Sample Barangay',
  city: 'Sample City',
  cityOfBirth: 'Sample City',
  countryOfBirth: 'Sample Country',
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
};

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberDetailFetcher: jest.fn(() => ({
    error: false,
    result: moockMemberDetail,
  })),
  useMemberKYCDetailFetcher: jest.fn(() => ({
    error: false,
    result: mockMemberKycDetail,
  })),
}));

jest.mock('../hooks/useMemberUpsert', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useMemberUpsert').default(props),
  }),
}));

const mockPropsCreate = {
  isActive: true,
  onHide: jest.fn(),
  selectedData: moockMemberDetail,
  fetchMemberList: jest.fn(),
};

const renderPageCreate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <ViewManageMemberModal {...mockPropsCreate} />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

describe('ViewManageMemberModal component', () => {
  it('renders component correctly with status unregistered', async () => {
    let renderPage: any;

    await act(async () => {
      renderPage = renderPageCreate();
    });

    expect(screen.getByText('detailTitle')).toBeInTheDocument();
    expect(screen.getByText('detailPhoneNumber')).toBeInTheDocument();

    fireEvent.click(screen.getByText('detailTabPersonalDataKYC'));

    renderPage.unmount();
  });
});
