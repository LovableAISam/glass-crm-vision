// Cores
import { useEffect, useState } from "react";

// Hooks & Utils
import { useSnackbar } from "notistack";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import useBaseUrlPrincipal from "@src/shared/hooks/useBaseUrlPrincipal";
import { useMerchantDetailFetcher, useMerchantListFetcher, useQrGeneratorFetcher } from "@woi/service/co";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";

// Types & Consts
import { OptionMap } from "@woi/option";
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { UploadDocumentData } from "@woi/uploadDocument";
import { BankStatus } from "@woi/service/principal/admin/bank/bankList";
import { MerchantDataList, MerchantListRequest } from "@woi/service/co/merchant/merchantList";
import { MerchantDetail } from "@woi/service/co/merchant/merchantDetail";

type FilterForm = {
    merchantName: string;
    merchantCode: string;
    status: boolean | '';
    activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
    merchantName: '',
    merchantCode: '',
    status: '',
    activeDate: {
        startDate: null,
        endDate: null,
    }
};

export interface ImageState {
    selectedFile: UploadDocumentData | null;
    selectedImage: string | null;
}

type useMerchantListProps = {
    showModalView: () => void;
    showModalCreate: () => void;
};

function useMerchantList(props: useMerchantListProps) {
    const { showModalView, showModalCreate } = props;
    const { baseUrl } = useBaseUrl();
    const { baseUrlPrincipal } = useBaseUrlPrincipal();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const [sortBy, setSortBy] = useState<keyof MerchantDataList>();
    const [direction, setDirection] = useState<"desc" | "asc">("desc");
    const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
    const [selectView, setSelectView] = useState<MerchantDataList | null>(null);
    const [selectEdit, setSelectEdit] = useState<MerchantDataList | null>(null);
    const [qrContent, setQRContent] = useState<string>('');
    const [merchantDetail, setMerchantDetail] = useState<MerchantDetail | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 0,
        limit: 10,
        totalPages: 0,
        totalElements: 0,
    });

    const debouncedFilter = useDebounce(filterForm, 300);
    const statusOptions: OptionMap<BankStatus>[] = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
    ];

    const handleSort = (columnId: keyof MerchantDataList) => {
        setSortBy(columnId);
        setDirection(oldDirection => (oldDirection === 'asc' ? 'desc' : 'asc'));
    };

    const merchantListPayload: MerchantListRequest = {
        merchantCompleteName: debouncedFilter.merchantName,
        merchantCode: debouncedFilter.merchantCode,
        status: debouncedFilter.status,
        effectiveDateFrom: stringToDateFormat(debouncedFilter.activeDate.startDate),
        effectiveDateTo: stringToDateFormat(debouncedFilter.activeDate.endDate),
        pageNumber: pagination.currentPage,
        pageSize: pagination.limit,
        sort: sortBy ? `${sortBy}:${direction}` : '',
    };

    const {
        data: _merchantListData,
        status: merchantListStatus,
        refetch: refetchMerchantList,
    } = useQuery(
        ['merchant-list', merchantListPayload],
        async () => useMerchantListFetcher(baseUrlPrincipal, merchantListPayload),
        {
            refetchOnWindowFocus: false,
            onSuccess: response => {
                const result = response.result;
                if (result && result.merchantList && !response.error) {
                    setPagination(oldPagination => ({
                        ...oldPagination,
                        totalPages: Math.ceil(result.totalElements / pagination.limit),
                        totalElements: result.totalElements,
                    }));
                }
            },
            onError: () => {
                setPagination(oldPagination => ({
                    ...oldPagination,
                    totalPages: 0,
                    currentPage: 0,
                    totalElements: 0,
                }));
            },
        },
    );

    const fetchMerchantQR = async (code: string) => {
        const { result, error } = await useQrGeneratorFetcher(baseUrl, {
            merchantCode: code,
        });
        if (result && !error) {
            setQRContent(result.qrString);
            generateQrCode();
        } else {
            enqueueSnackbar(error?.message || `Get QR Merchant failed!`, { variant: 'error' });
        }
    };

    const generateQrCode = () => {
        queryClient.invalidateQueries(['qr-generate']);
    };

    const fetchMerchantDetail = async (id: string) => {
        const { result, error } = await useMerchantDetailFetcher(baseUrl, id);
        if (result && !error) {
            setMerchantDetail(result);
            if (selectView !== null) {
                showModalView();
                if (result.qrType === 'Static') {
                    setQRContent('');
                    fetchMerchantQR(result.merchantCode);
                }
            } else if (selectEdit !== null) {
                showModalCreate();
            }
        } else {
            enqueueSnackbar(error?.message || `Get Detail Merchant failed!`, { variant: 'error' });
        }
    };

    useEffect(() => {
        if (selectEdit !== null || selectView !== null) {
            fetchMerchantDetail(selectEdit?.merchantId || selectView?.merchantId || '');
        }
    }, [selectEdit, selectView]);

    const fetchMerchantList = () => {
        refetchMerchantList();
    };

    return {
        statusOptions,
        sortBy,
        direction,
        pagination,
        merchantDetail,
        selectEdit,
        filterForm,
        setPagination,
        setSelectView,
        setSelectEdit,
        setFilterForm,
        setMerchantDetail,
        merchantListData: _merchantListData?.result?.merchantList || [],
        merchantListStatus,
        fetchMerchantList,
        handleSort,
        qrContent,
        generateQrCode
    };
}

export default useMerchantList;