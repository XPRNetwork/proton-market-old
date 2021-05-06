import { StyledTableRow } from './TableRow.styled';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const TableRow = ({ children }: Props): JSX.Element => (
  <StyledTableRow>{children}</StyledTableRow>
);
export default TableRow;
