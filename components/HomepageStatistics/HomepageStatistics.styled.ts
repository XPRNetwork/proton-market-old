import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { IconContainer } from '../CollectionIcon/CollectionIcon.styled';

type ContainerProps = {
  isLoading: boolean;
};

export const Container = styled.section<ContainerProps>`
  width: 100%;
  margin: 24px 0 16px;
  display: inline-grid;
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${breakpoint.mobile`
    grid-template-columns: repeat(1, minmax(0, 1fr));
  `}

  ${({ isLoading }) =>
    isLoading &&
    `
    height: 144px;
    display: flex;
    justify-content: center;
    align-items: center;
  `}
`;

export const Card = styled.article`
  width: 100%;
  height: 144px;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  display: flex;
  align-items: center;

  @media (max-width: 1300px) {
    justify-content: center;
  }

  ${breakpoint.mobile`
    justify-content: flex-start;
  `}
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;

  ${breakpoint.mobile`
    width: 100%;
    align-items: center;
    margin-right: 25%;
  `}
`;

export const Text = styled.h2`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  margin-bottom: 8px;

  ${breakpoint.tablet`
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 4px;
  `}

  ${breakpoint.mobile`
    font-size: 28px;
    line-height: 40px;
    margin-bottom: 8px;
  `}
`;

export const Subtext = styled.span`
  font-size: 10px;
  line-height: 16px;
  color: #808080;
`;

export const Icon = styled(IconContainer)`
  min-width: 64px;
  height: 64px;
  margin: 0 32px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;

  @media (max-width: 1300px) {
    margin-left: 0;
  }

  ${breakpoint.mobile`
    margin-left: 40px;
  `}
`;
