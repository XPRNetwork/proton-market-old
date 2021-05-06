import { ReactNode } from 'react';
import { StyledTableHeaderRow } from './TableHeader.styled';

type Props = {
  children: ReactNode;
};

const TableHeaderRow = ({ children }: Props): JSX.Element => (
  <StyledTableHeaderRow>{children}</StyledTableHeaderRow>
);
export default TableHeaderRow;
