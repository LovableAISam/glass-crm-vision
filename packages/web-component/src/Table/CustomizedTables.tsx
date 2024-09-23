// @ts-nocheck
import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer,
  TableHead,
  TableRow,
  Stack, 
  StackProps,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import Token from '../Token';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    ...theme.typography.body2,
    backgroundColor: Token.color.greyscaleGreyLightest,
    color: Token.color.greyscaleGreyDarkest,
    borderRight: 3,
    borderColor: Token.color.greyscaleGreyWhite,
    borderStyle: 'solid',
  },
  [`&.${tableCellClasses.body}`]: {
    ...theme.typography.body2,
    border: 0,
  },
}));

export const StyledTableCellSmall = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    ...theme.typography.caption,
    backgroundColor: Token.color.greyscaleGreyLightest,
    color: Token.color.greyscaleGreyDarkest,
    borderRight: 3,
    borderColor: Token.color.greyscaleGreyWhite,
    borderStyle: 'solid',
  },
  [`&.${tableCellClasses.body}`]: {
    ...theme.typography.caption,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
}));

export const StyledTableCellPrimary = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    ...theme.typography.body2,
    backgroundColor: Token.color.secondaryBlueTintLightest,
    color: Token.color.greyscaleGreyDarkest,
    borderRight: 3,
    borderColor: Token.color.greyscaleGreyWhite,
    borderStyle: 'solid',
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    ...theme.typography.body2,
    border: 0,
  },
}));

export const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    ...theme.typography.body2,
    backgroundColor: Token.color.greyscaleGreyWhite,
    color: Token.color.greyscaleGreyDarkest,
    borderRight: 3,
    borderColor: Token.color.greyscaleGreyWhite,
    borderStyle: 'solid',
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    ...theme.typography.body2,
    border: 0,
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({}));

type TableColor = 'primary' | 'default';

// Props
export type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
  stackProps?: StackProps;
};

// Table Header

type TableHeaderCustomProps<T, K extends keyof T> = {
  columns: Array<ColumnDefinitionType<T, K>>;
  color: TableColor;
};

const TableHeaderCustom = <T, K extends keyof T>({ columns, color }: TableHeaderCustomProps<T, K>): JSX.Element => {
  const TableCellTemp = color === 'primary' ? StyledTableCellPrimary : StyledTableCell;

  const headers = columns.map((column, index) => {
    return (
      <TableCellTemp key={index} sx={{ width: column.width }}>
        <Stack {...column.stackProps}>{column.header}</Stack>
      </TableCellTemp>
    );
  });

  return (
    <TableHead>
      <TableRow>{headers}</TableRow>
    </TableHead>
  );
};

// Table Row

type TableRowsCustomProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
};

const TableRowsCustom = <T, K extends keyof T>({ data, columns }: TableRowsCustomProps<T, K>): JSX.Element => {
  const rows = data.map((row, index) => {
    return (
      <StyledTableRow key={index}>
        {columns.map((column, index2) => {
          return (
            <StyledTableCell key={index2}>
              <Stack {...column.stackProps}>{row[column.key]}</Stack>
            </StyledTableCell>
          );
        })}
      </StyledTableRow>
    );
  });

  return <TableBody>{rows}</TableBody>;
};

// Table Container

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
  color?: TableColor;
};

const CustomizedTables = <T, K extends keyof T>({
  data,
  columns,
  color = 'default',
}: TableProps<T, K>): JSX.Element => {
  return (
    <TableContainer>
      <Table aria-label="customized table">
        <TableHeaderCustom color={color} columns={columns} />
        <TableRowsCustom data={data} columns={columns} />
      </Table>
    </TableContainer>
  );
};

export default CustomizedTables;
