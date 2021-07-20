import { useRouter } from 'next/router';
import TemplateCard from '../TemplateCard';
import { useAuthContext } from '../Provider/AuthProvider';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';

type Props = {
  isLoadingPrices: boolean;
  items: Template[];
};

const Grid = ({ isLoadingPrices, items }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isUsersTemplates =
    currentUser && router.query.chainAccount === currentUser.actor;

  return (
    <Container>
      {items.map((template) => (
        <TemplateCard
          key={template.template_id}
          template={template}
          isUsersTemplates={isUsersTemplates}
          hasShimmer={isLoadingPrices}
        />
      ))}
    </Container>
  );
};

Grid.defaultProps = {
  items: [],
  isLoadingPrices: false,
};

export default Grid;
