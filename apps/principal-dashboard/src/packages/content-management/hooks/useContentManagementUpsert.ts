import { useSnackbar } from "notistack";
import { useState } from "react";
import useModal from "@woi/common/hooks/useModal";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { DatePeriod } from "@woi/core/utils/date/types";
import { useContentListFetcher } from "@woi/service/co";

export interface ContentData {
    contentName: string;
    createdDate: string;
    content: string;
    id: string;
}

interface PaginationData {
    currentPage: number;
    limit: number;
    totalPages: number;
    totalElements: number;
    totalCurrentElements: number;
}

export interface OptionMap<T> {
    label: string;
    value: T;
    createdBy: string;
    createdDate: string;
    id: string;
    modifiedBy: string;
    modifiedDate: string;
    name: string;
    type: string;
    secureId: string;
}

export interface ContentDetail {
    content: string;
    contentName: {
        createdDate: string;
        id: string;
        modifiedDate: string;
        name: string;
        type: string;
    };
    createdDate: string;
    id: string;
    modifiedDate: string;
    subject: string;
}

export type FormValues = {
    contentType: string | null;
    contentName: string;
    multipleContent: {
        title: string;
        description: string;
        id: string;
    }[];
};

export type FilterTable = {
    contentName: string;
    createdDate: DatePeriod;
};

export const initialFilterTable: FilterTable = {
    contentName: '',
    createdDate: {
        startDate: null,
        endDate: null,
    },
};

function useContentManagementUpsert() {
    const { baseUrl } = useBaseUrl();
    const { enqueueSnackbar } = useSnackbar();

    const [isActive, showModal, hideModal] = useModal();
    const [filterForm, setFilterForm] = useState<FilterTable>(initialFilterTable);
    const [pagination, setPagination] = useState<PaginationData>({
        limit: 10,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
        totalCurrentElements: 0
    });

    return {
        enqueueSnackbar, isActive, showModal, hideModal, filterForm, setFilterForm, pagination, setPagination, baseUrl, useContentListFetcher,
    };
}

export default useContentManagementUpsert;