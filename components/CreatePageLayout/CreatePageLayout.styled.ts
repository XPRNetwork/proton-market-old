import styled from 'styled-components';
import { StyledButton } from '../Button/Button.styled';

export const Container = styled.section`
  max-width: 60%;
  min-width: 864px;
  width: 100%;
  margin: 0 auto;
  margin-top: 40px;
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 424px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin-left: 120px;
`;

export const ElementTitle = styled.h2`
  font-family: CircularStdBold;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

export const Step = styled.h4`
  font-family: CircularStdBold;
  font-size: 10px;
  line-height: 1.6;
  color: #752eeb;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  margin-top: 8px;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  margin-top: 8px;
  max-width: 424px;
  margin-bottom: 24px;
`;

export const Terms = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #808080;
`;

export const TermsLink = styled.a`
  font-size: 12px;
  line-height: 20px;
  color: #752eeb;
  cursor: pointer;
  margin-bottom: 24px;
`;

export const ErrorMessage = styled.p`
  font-size: 14px;
  color: #f94e6c;
  margin: 10px 0;
`;

export const BackButton = styled(StyledButton)`
  background-color: transparent;
  color: rgb(117, 46, 235);
  padding: 12px 16px;

  :hover {
    color: rgba(117, 46, 235, 0.55);
    background-color: transparent;
    box-shadow: none;
  }
`;

export const FeeLabel = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  margin: 8px 0 20px;
`;
