import styled from 'styled-components';

type ButtonProps = {
  isHidden: boolean;
  disabled: boolean;
};

export const Button = styled.button<ButtonProps>`
  ${({ isHidden }) => isHidden && `display: none;`}
  padding: 8px 16px;
  margin: 24px 0 12px;
  border-radius: 4px;
  border: 1px solid #e8ecfd;
  transition: 0.2s;
  width: 100%;
  transform: rotate(-180deg);
  -webkit-transform: rotate(-180deg);
  background-color: #ffffff;

  ${({ disabled }) =>
    !disabled &&
    `
    cursor: pointer;
    :hover {
      opacity: 1;
      color: #ffffff;
      background-color: #8a9ef5;
      box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24),
        0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
    }
  `}
`;
