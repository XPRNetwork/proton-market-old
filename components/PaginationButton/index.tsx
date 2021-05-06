import { useInView } from 'react-intersection-observer';
import { Button } from './PaginationButton.styled';
import { ReactComponent as Arrow } from '../../public/arrow.svg';
import { ReactComponent as Loading } from '../../public/loading.svg';
import { useEffect } from 'react';

type Props = {
  onClick: () => Promise<void>;
  disabled: boolean;
  isLoading: boolean;
  isHidden?: boolean;
  autoLoad?: boolean;
};

const PaginationButton = ({
  onClick,
  disabled,
  isLoading,
  isHidden,
  autoLoad,
}: Props): JSX.Element => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (autoLoad && inView && !isLoading && !isHidden) {
      onClick();
    }
  }, [inView]);

  return (
    <Button
      ref={ref}
      aria-label="Next page"
      onClick={onClick}
      disabled={disabled || isLoading}
      isHidden={isHidden || (disabled && !isLoading)}>
      {isLoading ? <Loading /> : <Arrow />}
    </Button>
  );
};

export default PaginationButton;
