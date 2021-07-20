import styled from 'styled-components';

type BlurProps = {
  img: string;
};

type BottomSectionProps = {
  height: string;
};

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
  position: relative;
  transition: 0.3s;
  cursor: pointer;
  overflow: hidden;

  :hover {
    transform: scale(1.02);
  }

  :focus-visible {
    transform: scale(1.02);
  }
`;

export const BlurContainer = styled.div`
  height: 136px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const Blur = styled.div<BlurProps>`
  width: 125%;
  height: 125%;
  left: -30px;
  top: -15px;
  position: absolute;
  background-image: ${({ img }) => `url('${img}')`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-filter: blur(10px);
  filter: blur(10px);
  background-color: rgba(230, 230, 230, 0.3);
  backface-visibility: hidden;
`;

export const BottomSection = styled.div<BottomSectionProps>`
  height: ${({ height }) => height};
  padding: 66px 24px 0;
`;

export const IconContainer = styled.div`
  position: absolute;
  width: 88px;
  height: 88px;
  top: 90px;
  border-radius: 100%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.08);
`;

export const Title = styled.h3`
  font-size: 28px;
  line-height: 1.43;
  color: #1a1a1a;
  margin-bottom: 4px;
  overflow-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #808080;
  overflow-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const PurpleName = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #752eeb;
`;
