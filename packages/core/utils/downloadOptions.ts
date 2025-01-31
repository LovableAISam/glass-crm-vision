export interface CheckboxFileFormat {
    name: string;
    label: string;
}

export const fileFormats: CheckboxFileFormat[] = [
    { name: 'PDF', label: 'PDF' },
    { name: 'CSV', label: 'CSV' },
    { name: 'EXCEL', label: 'Excel' },
];