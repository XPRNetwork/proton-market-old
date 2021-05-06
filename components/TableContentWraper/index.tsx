import { ReactNode } from 'react';
import Spinner from '../Spinner';
import { BlankRow, CenteredCell } from './TableContentWrapper.styled';
import TableRow from '../TableRow';

type TableContentWrapperProps = {
  children: ReactNode;
  error?: string;
  loading: boolean;
  columns: number;
  noData: boolean;
  noDataMessage?: string;
};

const TableContentWrapper = ({
  children,
  error,
  loading,
  columns,
  noData,
  noDataMessage = 'No Data',
}: TableContentWrapperProps): JSX.Element => {
  if (error) {
    return (
      <TableRow>
        <CenteredCell colSpan={columns}>{error}</CenteredCell>
      </TableRow>
    );
  } else if (loading) {
    return (
      <BlankRow>
        <CenteredCell colSpan={columns}>
          <Spinner />
        </CenteredCell>
      </BlankRow>
    );
  } else if (noData) {
    return (
      <TableRow>
        <CenteredCell colSpan={columns}>{noDataMessage}</CenteredCell>
      </TableRow>
    );
  } else {
    return <>{children}</>;
  }
};

export default TableContentWrapper;
