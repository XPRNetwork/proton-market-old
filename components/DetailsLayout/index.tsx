import { Dispatch, SetStateAction, ReactNode, FC } from 'react';
import {
  Container,
  Row,
  Column,
  TabTitle,
  TabRow,
} from './DetailsLayout.styled';
import SalesHistoryTable from '../SalesHistoryTable';
import AssetFormTitle from '../AssetFormTitle';
import AssetDisplay from '../AssetDisplay';
import AssetMeta from '../AssetMeta';
import { SaleAsset } from '../../services/sales';
import { Asset } from '../../services/assets';
import { tabs } from '../../components/SalesHistoryTable';

type Props = {
  children: ReactNode;
  image?: string;
  video?: string;
  model?: string;
  stage?: string;
  skybox?: string;
  templateId: string;
  templateName: string;
  collectionDisplayName?: string;
  collectionName: string;
  collectionAuthor: string;
  collectionImage: string;
  error?: string;
  currentAsset?: Partial<SaleAsset> & Partial<Asset>;
  assetIds?: string[];
  saleIds?: string[];
  activeTab: string;
  isRefetchingAssets?: boolean;
  createdAtTime: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCurrentAssetAsModalProps?: () => void;
};

const DetailsLayout: FC<Props> = ({
  children,
  image,
  video,
  model,
  stage,
  skybox,
  templateId,
  templateName,
  collectionName,
  collectionDisplayName,
  collectionAuthor,
  collectionImage,
  error,
  currentAsset,
  assetIds,
  saleIds,
  activeTab,
  createdAtTime,
  isRefetchingAssets,
  setActiveTab,
  setCurrentAssetAsModalProps,
}) => {
  return (
    <Container>
      <AssetMeta
        templateName={templateName}
        collectionName={collectionName}
        collectionDisplayName={collectionDisplayName}
        collectionAuthor={collectionAuthor}
        image={image}
        video={video}
        model={model}
      />
      <Row>
        <AssetDisplay
          image={image}
          video={video}
          model={model}
          stage={stage}
          skybox={skybox}
          templateName={templateName}
          created={createdAtTime}
        />

        <Column>
          <AssetFormTitle
            templateName={templateName}
            collectionDisplayName={collectionDisplayName}
            collectionName={collectionName}
            collectionAuthor={collectionAuthor}
            collectionImage={collectionImage}
            saleIds={saleIds}
            assetIds={assetIds}
            isRefetchingAssets={isRefetchingAssets}
            setCurrentAssetAsModalProps={setCurrentAssetAsModalProps}
          />
          {children}
        </Column>
      </Row>
      <TabRow>
        {tabs.map(({ type, title }) => {
          return (
            <TabTitle
              key={type}
              onClick={() => setActiveTab(type)}
              isActive={activeTab === type}>
              {title}
            </TabTitle>
          );
        })}
      </TabRow>
      <SalesHistoryTable
        activeTab={activeTab}
        error={error}
        asset={currentAsset}
        templateId={templateId}
      />
    </Container>
  );
};

export default DetailsLayout;
