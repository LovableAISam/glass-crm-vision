import React, { useEffect } from 'react';
import {
  useTable,
  useExpanded,
  useRowSelect,
  useResizeColumns,
  TableState,
  Column,
} from 'react-table';
import {
  TableRow,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Stack,
  Typography,
  TableSortLabel,
} from '@mui/material';
import {
  StyledTableCellHeader,
  StyledTableCellPrimary,
  StyledTableCell,
  StyledTableCellSmall,
  StyledTableRow,
} from './CustomizedTables';
import Token from '../Token';
import LoadingPage from '../Loading/LoadingPage';

type CollapsibleItemMethods = {
  expanded?: boolean;
  data?: any;
  index?: number;
};

type TableRowRenderMethods = {
  data?: any;
  index: number;
};

type StyledDatatableProps = {
  columns: Column<object>[];
  defaultColumn?: Partial<Column<object>>;
  data: object[];
  children?: (methods: TableState<object>) => React.ReactElement;
  collapsibleItem?: (methods: CollapsibleItemMethods) => React.ReactElement;
  dense?: boolean;
  loading?: boolean;
  coloredHeader?: boolean;
  sortable?: boolean;
  tableRow?: (methods: TableRowRenderMethods) => React.ReactElement;
  onChangeState?: (methods: TableState<object>) => void;
  initialState?: Partial<TableState<object>>;
  getHeaderProps?: (column: any) => void;
  getColumnProps?: (column: any) => void;
  getRowProps?: (column: any) => void;
  getCellProps?: (column: any) => void;
  direction?: 'desc' | 'asc';
  sortBy?: string;
  onSort?: (columnId: keyof object) => void;
  hideHeaderSort?: string[];
  tableHeaderGroup?: React.ReactNode;
};

// Create a default prop getter
const defaultPropGetter = () => ({});

// @ts-ignore
export default function StyledDatatable(props: StyledDatatableProps) {
  const {
    columns,
    defaultColumn,
    data,
    children,
    collapsibleItem,
    dense = false,
    loading = false,
    coloredHeader = false,
    sortable = true,
    tableRow,
    initialState,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
    direction,
    sortBy,
    onSort,
    hideHeaderSort = [],
    tableHeaderGroup,
  } = props;

  const TableCellBody = dense ? StyledTableCellSmall : StyledTableCell;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    headers,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        ...initialState,
      },
      defaultColumn,
    },
    useExpanded,
    useRowSelect,
    useResizeColumns,
  );

  useEffect(() => {
    if (props.onChangeState) {
      props.onChangeState(state);
    }
  }, [state]);

  const StyledTableCellWrapper = coloredHeader
    ? StyledTableCellPrimary
    : StyledTableCellHeader;

  return (
    <Stack direction="column" spacing={2}>
      {children && children(state)}
      <TableContainer>
        <Table stickyHeader aria-label="customized table" {...getTableProps()}>
          <TableHead>
            {tableHeaderGroup}
            {headerGroups.map(headerGroup => {
              return (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => {
                    return (
                      <StyledTableCellWrapper
                        {...column.getHeaderProps([
                          {
                            className: column.className,
                            style: column.style,
                          },
                          getColumnProps(column),
                          getHeaderProps(column),
                        ])}
                      >
                        {sortable && !hideHeaderSort.includes(column.id) ? (
                          <TableSortLabel
                            active={column.id === sortBy}
                            direction={direction}
                            onClick={() => onSort?.(column.id as keyof object)}
                          >
                            {column.render('Header')}
                          </TableSortLabel>
                        ) : (
                          column.render('Header')
                        )}
                      </StyledTableCellWrapper>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row: any, idx) => {
              prepareRow(row);
              return (
                <React.Fragment key={idx}>
                  {tableRow ? (
                    tableRow({ data: row.original, index: row.index })
                  ) : (
                    <StyledTableRow
                      {...row.getRowProps(getRowProps(row))}
                      selected={Boolean(row.index % 2)}
                      hover
                    >
                      {row.cells.map((cell: any) => {
                        return (
                          <TableCellBody
                            {...cell.getCellProps([
                              {
                                className: cell.column.className,
                                style: cell.column.style,
                              },
                              getColumnProps(cell.column),
                              getCellProps(cell),
                            ])}
                          >
                            {cell.render('Cell')}
                          </TableCellBody>
                        );
                      })}
                    </StyledTableRow>
                  )}
                  {collapsibleItem && (
                    <StyledTableRow hover>
                      <TableCellBody sx={{ p: 0 }} colSpan={row.cells.length}>
                        {collapsibleItem({
                          expanded: row.isExpanded,
                          data: row.original,
                          index: row.index,
                        })}
                      </TableCellBody>
                    </StyledTableRow>
                  )}
                </React.Fragment>
              );
            })}
            {rows.length === 0 && (
              <StyledTableRow>
                <TableCellBody sx={{ py: 5 }} colSpan={headers.length}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {loading ? (
                      <LoadingPage />
                    ) : (
                      <Typography
                        variant="body2"
                        color={Token.color.greyscaleGreyDarkest}
                      >
                        Table is empty
                      </Typography>
                    )}
                  </Stack>
                </TableCellBody>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
