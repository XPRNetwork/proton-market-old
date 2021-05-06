import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const AvatarImage = styled.div`
  border-radius: 100%;
  overflow: hidden;
  width: 32px;
  height: 32px;
  margin-left: 10px;
`;

export const ImageDataCell = styled.td`
  vertical-align: middle;
  cursor: pointer;
  text-align: ${({ align }) => (align ? align : ' center')};

  ${breakpoint.mobile`
    padding: 0px 5px;
  `}
`;
