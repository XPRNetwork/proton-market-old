import { useRouter } from 'next/router';
import Button from '../Button';
import { Container, QuestionIcon, Text } from './Error.styled';

type Props = {
  errorMessage: string;
  buttonText?: string;
  buttonOnClick?: () => void;
};

const Error = ({
  errorMessage,
  buttonText,
  buttonOnClick,
}: Props): JSX.Element => {
  const router = useRouter();
  const onClick = buttonOnClick ? buttonOnClick : () => router.push('/');
  return (
    <Container>
      <QuestionIcon role="img" />
      <Text>{errorMessage}</Text>
      <Button onClick={onClick}>{buttonText}</Button>
    </Container>
  );
};

Error.defaultProps = {
  buttonText: 'Explore',
};

export default Error;
