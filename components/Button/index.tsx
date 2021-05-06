import { StyledButton } from './Button.styled';

type Props = {
  children: string | JSX.Element;
  onClick: () => void;
  fullWidth?: boolean;
  cancel?: boolean;
  margin?: string;
  padding?: string;
  smallSize?: boolean;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  fullWidth,
  cancel,
  margin,
  padding,
  smallSize,
  disabled,
}: Props): JSX.Element => (
  <StyledButton
    cancel={cancel}
    fullWidth={fullWidth}
    disabled={disabled}
    margin={margin}
    padding={padding}
    smallSize={smallSize}
    onClick={onClick}>
    {children}
  </StyledButton>
);

Button.defaultProps = {
  margin: '12px 0',
  padding: '12px 16px',
};

export default Button;
