import { Container } from './LoadingPage.styled';
import Spinner from '../Spinner';

type Props = {
  margin: string;
};

const LoadingPage = ({ margin }: Props): JSX.Element => {
  return (
    <Container margin={margin}>
      <Spinner />
    </Container>
  );
};

LoadingPage.defaultProps = {
  margin: '25vh 0',
};

export default LoadingPage;
