import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CollectionIcon from '../CollectionIcon';
import {
  NameContainer,
  Name,
  AuthorText,
  Title,
  Author,
  CollectionNameButton,
} from './AssetFormTitle.styled';
import AssetFormPopupMenu from '../AssetFormPopupMenu';
import { useAuthContext } from '../Provider';

type Props = {
  templateName: string;
  collectionDisplayName?: string;
  collectionName: string;
  collectionAuthor: string;
  collectionImage: string;
  assetIds?: string[];
  saleIds?: string[];
  setCurrentAssetAsModalProps?: () => void;
};

const AssetFormTitle = ({
  templateName,
  collectionName,
  collectionDisplayName,
  collectionAuthor,
  collectionImage,
  assetIds,
  saleIds,
  setCurrentAssetAsModalProps,
}: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const redirectToAuthor = () => router.push(`/user/${collectionAuthor}`);
  const redirectToCollection = () => router.push(`/${collectionName}`);

  useEffect(() => {
    router.prefetch(`/user/${collectionAuthor}`);
  }, []);

  return (
    <>
      <CollectionNameButton onClick={redirectToCollection}>
        <CollectionIcon image={collectionImage} name={collectionName} />
        <Title>{collectionDisplayName || collectionName}</Title>
      </CollectionNameButton>
      <NameContainer>
        <Name>{templateName}</Name>
        {isMyTemplate && (
          <AssetFormPopupMenu
            setCurrentAssetAsModalProps={setCurrentAssetAsModalProps}
            assetIds={assetIds}
            saleIds={saleIds}
            isTemplateCreator={
              currentUser && collectionAuthor === currentUser.actor
            }
          />
        )}
      </NameContainer>
      <AuthorText>
        Created by{' '}
        <Author onClick={redirectToAuthor}>{collectionAuthor}</Author>
      </AuthorText>
    </>
  );
};

export default AssetFormTitle;
