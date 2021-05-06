import { StyledTableHeaderCell } from './TableHeaderCell.styled';

type Props = {
  children: string;
};

const TableHeaderCell = ({ children }: Props): JSX.Element => (
  <StyledTableHeaderCell>{children}</StyledTableHeaderCell>
);

export default TableHeaderCell;
