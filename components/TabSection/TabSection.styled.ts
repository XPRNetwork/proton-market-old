import styled from 'styled-components';
export { Section } from '../../styles/index.styled';
import { Row as StyledRow } from '../../styles/index.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const Row = styled(StyledRow)`
  ${breakpoint.mobile`
    flex-direction: column;
    margin: 0 0 28px 0;
    align-items: flex-end;
  `}
`;
