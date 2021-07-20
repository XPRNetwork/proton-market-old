import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const ImageDataCell = styled.td`
  vertical-align: middle;
  cursor: pointer;
  text-align: ${({ align }) => (align ? align : ' center')};

  ${breakpoint.mobile`
    padding: 0px 5px;
  `}
`;
