import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  margin: 10% 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const QuestionIcon = styled.div`
  font-family: CircularStdBold;
  font-size: 50px;
  width: 94px;
  height: 94px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: #8a9ef5;
  background-color: #f1f3fe;
  border-radius: 35px;
  :before {
    content: '?';
  }
`;

export const Text = styled.p`
  font-family: CircularStdBold;
  font-size: 18px;
  line-height: 24px;
  color: #0e103c;
  max-width: 280px;
  text-align: center;
  margin: 32px 0 20px;
`;
