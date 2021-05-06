import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
  FocusEventHandler,
} from 'react';
import Tooltip from '../Tooltip';
import { InputContainer, Input, ErrorMessage } from './InputField.styled';

type Props = {
  inputType: string;
  value: string | number;
  placeholder: string;
  setValue: Dispatch<SetStateAction<string | number>>;
  setFormError?: Dispatch<SetStateAction<string>>;
  checkIfIsValid: (
    text: string | number
  ) => {
    isValid: boolean;
    errorMessage: string;
  };
  submit?: () => Promise<void>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  tooltip?: string;
  numberOfTooltipLines?: number;
  halfWidth?: boolean;
  mr?: string;
  ml?: string;
  mt?: string;
  mb?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

const InputField = ({
  inputType,
  value,
  placeholder,
  setValue,
  setFormError,
  checkIfIsValid,
  submit,
  onBlur,
  tooltip,
  numberOfTooltipLines,
  halfWidth,
  mr,
  ml,
  mt,
  mb,
  min,
  max,
  step,
  disabled,
}: Props): JSX.Element => {
  const [error, setError] = useState<string>('');

  const updateText = (e: ChangeEvent<HTMLInputElement>) => {
    const textInput = e.target.value;
    if (setFormError) setFormError('');
    setError('');
    setValue(textInput);
    if (!textInput.length) return;

    const { isValid, errorMessage } = checkIfIsValid(textInput);
    if (!isValid) {
      setError(errorMessage);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const validChars = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '.',
      'Enter',
      'Backspace',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (inputType === 'number' && !validChars.includes(e.key) && !e.metaKey) {
      e.preventDefault();
    }

    if (e.key === 'Enter' && submit) {
      submit();
    }
  };

  return (
    <InputContainer
      halfWidth={halfWidth}
      mr={mr}
      ml={ml}
      mt={mt}
      mb={mb}
      hasError={!!error}
      disabled={disabled}>
      <Input
        min={min}
        max={max}
        step={step}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={updateText}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {tooltip ? (
        <Tooltip text={tooltip} numberOfLines={numberOfTooltipLines} />
      ) : null}
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </InputContainer>
  );
};

InputField.defaultProps = {
  halfWidth: false,
  inputType: 'text',
  placeholder: '',
  setValue: () => {},
  checkIfIsValid: () => ({
    isValid: true,
    errorMessage: '',
  }),
};

export default InputField;
