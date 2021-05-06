import { useRouter } from 'next/router';
import TemplateCard from '../TemplateCard';
import { useAuthContext } from '../Provider/AuthProvider';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';

type Props = {
  items: Template[];
};

const Grid = ({ items }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isUsersTemplates =
    currentUser && router.query.chainAccount === currentUser.actor;

  return (
    <Container>
      {items.map(
        ({
          name,
          template_id,
          collection: { collection_name, img, name: collectionDisplayName },
          immutable_data: { image, video },
          issued_supply,
          max_supply,
          lowestPrice,
          totalAssets,
          assetsForSale,
          created_at_time,
        }) => {
          const redirectPath = isUsersTemplates
            ? `/details/${currentUser.actor}/${collection_name}/${template_id}`
            : `/${collection_name}/${template_id}`;
          const ownerHasMultiple =
            totalAssets &&
            !isNaN(parseInt(totalAssets)) &&
            parseInt(totalAssets) > 1;
          const hasMultiple =
            !totalAssets && !isNaN(parseInt(issued_supply))
              ? parseInt(issued_supply) > 1
              : false;
          return (
            <TemplateCard
              key={template_id}
              collectionDisplayName={collectionDisplayName}
              collectionName={collection_name}
              templateName={name}
              maxSupply={max_supply}
              redirectPath={redirectPath}
              isUsersTemplates={isUsersTemplates}
              totalAssets={totalAssets}
              assetsForSale={assetsForSale}
              collectionImage={img}
              templateVideo={video}
              templateImage={image}
              createdAt={created_at_time}
              price={lowestPrice}
              hasMultiple={ownerHasMultiple || hasMultiple}
            />
          );
        }
      )}
    </Container>
  );
};

Grid.defaultProps = {
  items: [],
};

export default Grid;
