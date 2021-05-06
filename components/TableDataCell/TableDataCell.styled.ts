import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type StyledTableDataCellProps = {
  onClick?: () => void;
  color?: string;
};

export const StyledTableDataCell = styled.td<StyledTableDataCellProps>`
  display: table-cell;
  vertical-align: middle;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: ${({ color }) => color || '#1a1a1a'};
  text-align: 'left';

  ${({ onClick }) => (onClick ? 'cursor: pointer;' : '')}

  ${breakpoint.mobile`
    padding: 0px 10px;
  `}
`;
