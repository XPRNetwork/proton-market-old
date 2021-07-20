import { useState, useEffect } from 'react';
import TableHeaderRow from '../TableHeaderRow';
import TableHeaderCell from '../TableHeaderCell';
import TableRow from '../TableRow';
import TableContentWrapper from '../TableContentWraper';
import SalesHistoryTableCell, { BuyerContent } from '../SalesHistoryTableCell';
import PaginationButton from '../../components/PaginationButton';
import { addPrecisionDecimal, parseTimestamp } from '../../utils';
import { StyledTable } from './SalesHistoryTable.styled';
import { useWindowSize } from '../../hooks';
import { getFromApi } from '../../utils/browser-fetch';
import { useAuthContext } from '../Provider';
import {
  SaleAsset,
  Sale,
  getSalesHistoryForTemplate,
  getSalesHistoryForAsset,
} from '../../services/sales';
import { Asset } from '../../services/assets';
import { PAGINATION_LIMIT, TAB_TYPES } from '../../utils/constants';

type Props = {
  error?: string;
  asset?: Partial<SaleAsset> & Partial<Asset>;
  activeTab: string;
  templateId: string;
};

type TableHeader = {
  title: string;
  id: string;
};

type SalesById = {
  [id: string]: {
    id?: string;
    page: number;
    data: Sale[];
  };
};

const emptyHeader = { title: '', id: '' };

export const tabs = [
  { title: 'Item History', type: TAB_TYPES.ITEM },
  { title: 'Global History', type: TAB_TYPES.GLOBAL },
];

const salesHistoryTableHeaders = [
  emptyHeader,
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'SERIAL', id: 'serial' },
  { title: 'DATE/TIME', id: 'date' },
  { title: 'TX', id: 'tx' },
];

const mobileSalesHistoryTableHeaders = [
  emptyHeader,
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'TX', id: 'tx' },
];

const getAvatars = async (
  chainAccounts: string[]
): Promise<{ [chainAccount: string]: string }> => {
  try {
    const queryString = chainAccounts
      .map((account) => encodeURIComponent(account))
      .join('&accounts=');

    const res = await getFromApi<{ [account: string]: string }>(
      `/api/profile?accounts=${queryString}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    return res.message;
  } catch (e) {
    throw new Error(e);
  }
};

const SalesHistoryTable = ({
  error,
  asset,
  activeTab,
  templateId,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [avatars, setAvatars] = useState<{ [buyer: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [salesById, setSalesById] = useState<SalesById>({
    [TAB_TYPES.GLOBAL]: {
      id: '',
      page: 1,
      data: [],
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>([]);
  const { isMobile } = useWindowSize();

  const salesByIdType =
    activeTab === TAB_TYPES.GLOBAL
      ? TAB_TYPES.GLOBAL
      : asset.asset_id || asset.assetId;

  useEffect(() => {
    (async () => {
      setIsLoadingNextPage(true);
      try {
        if (templateId && templateId !== salesById[TAB_TYPES.GLOBAL].id) {
          const globalSales = await getSalesHistoryForTemplate(templateId, 1);
          setSalesById((prevSales) => ({
            ...prevSales,
            [TAB_TYPES.GLOBAL]: {
              id: templateId,
              page: globalSales.length < PAGINATION_LIMIT ? -1 : 2,
              data: globalSales,
            },
          }));
        }

        const assetId = asset ? asset.asset_id || asset.assetId : 0;
        if (assetId) {
          const salesForCurrentAsset = await getSalesHistoryForAsset(
            assetId,
            1
          );

          setSalesById((prevSales) => ({
            ...prevSales,
            [assetId]: {
              page: salesForCurrentAsset.length < PAGINATION_LIMIT ? -1 : 2,
              data: salesForCurrentAsset,
            },
          }));
        }
      } catch (e) {
        setErrorMessage(e.message);
      }
      setIsLoadingNextPage(false);
    })();
  }, [templateId, asset]);

  useEffect(() => {
    if (isMobile) {
      setTableHeaders(mobileSalesHistoryTableHeaders);
    } else {
      setTableHeaders(salesHistoryTableHeaders);
    }
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      const globalSales = salesById[TAB_TYPES.GLOBAL].data;
      if (globalSales) {
        try {
          const assetSales = salesById[asset.asset_id || asset.assetId]
            ? salesById[asset.asset_id || asset.assetId].data
            : [];

          if (globalSales.length || assetSales.length) {
            const chainAccounts = [
              ...new Set(
                globalSales.concat(assetSales).map(({ buyer }) => buyer)
              ),
            ];

            const res = await getAvatars(chainAccounts);
            setAvatars(res);
          }
        } catch (e) {
          setErrorMessage(e.message);
        }
      }
      setIsLoading(false);
    })();
  }, [salesById]);

  useEffect(() => {
    if (currentUser) {
      setAvatars({
        ...avatars,
        [currentUser.actor]: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const fetchNextGlobalPage = async () => {
    const { page } = salesById[TAB_TYPES.GLOBAL];
    const globalSales = await getSalesHistoryForTemplate(templateId, page);

    setSalesById((prevSales) => ({
      ...prevSales,
      [TAB_TYPES.GLOBAL]: {
        id: templateId,
        page:
          globalSales.length < PAGINATION_LIMIT
            ? -1
            : prevSales[TAB_TYPES.GLOBAL].page + 1,
        data: [...prevSales[TAB_TYPES.GLOBAL].data, ...globalSales],
      },
    }));
  };

  const fetchNextAssetPage = async () => {
    if (!asset) return;
    const assetId = asset.asset_id || asset.assetId;
    const sales = await getSalesHistoryForAsset(
      assetId,
      salesById[assetId].page
    );
    setSalesById((prevSales) => ({
      ...prevSales,
      [assetId]: {
        page:
          sales.length < PAGINATION_LIMIT ? -1 : prevSales[assetId].page + 1,
        data: [...prevSales[assetId].data, ...sales],
      },
    }));
  };

  const showNextPage = async () => {
    setIsLoadingNextPage(true);
    if (activeTab === TAB_TYPES.GLOBAL) {
      await fetchNextGlobalPage();
    } else {
      await fetchNextAssetPage();
    }
    setIsLoadingNextPage(false);
  };

  const noDataMessage =
    activeTab === TAB_TYPES.GLOBAL ||
    !(asset.templateMint || asset.template_mint)
      ? 'No Recent Sales'
      : `No Recent Sales for Serial #${
          asset.templateMint || asset.template_mint
        }`;

  const getTableContent = () => {
    const sales =
      salesByIdType && salesById[salesByIdType]
        ? salesById[salesByIdType].data
        : [];
    return sales.map((sale) => (
      <TableRow key={sale.sale_id}>
        {tableHeaders.map(({ id }) => {
          const content = getCellContent(sale, id, avatars);
          return <SalesHistoryTableCell key={id} id={id} content={content} />;
        })}
      </TableRow>
    ));
  };

  const getPaginationButton = () => {
    const isPaginationButtonHidden =
      !salesById[salesByIdType] ||
      (salesById[salesByIdType] &&
        salesById[salesByIdType].data.length < PAGINATION_LIMIT);
    const isPaginationButtonDisabled =
      !salesById[salesByIdType] ||
      (salesById[salesByIdType] && salesById[salesByIdType].page === -1);
    return (
      <PaginationButton
        onClick={showNextPage}
        isHidden={isPaginationButtonHidden}
        isLoading={isLoadingNextPage}
        disabled={isPaginationButtonDisabled}
        autoLoad
      />
    );
  };

  return (
    <>
      <StyledTable aria-label="sales-history-table" role="table">
        <thead>
          <TableHeaderRow>
            {tableHeaders.map((header) => {
              return (
                <TableHeaderCell key={header.title}>
                  {header.title}
                </TableHeaderCell>
              );
            })}
          </TableHeaderRow>
        </thead>
        <tbody>
          <TableContentWrapper
            error={
              errorMessage ? `An error has occurred: ${errorMessage}` : null
            }
            loading={isLoading}
            noData={
              !salesById[salesByIdType] || !salesById[salesByIdType].data.length
            }
            noDataMessage={isLoadingNextPage ? '' : noDataMessage}
            columns={tableHeaders.length}>
            {getTableContent()}
          </TableContentWrapper>
        </tbody>
      </StyledTable>
      {getPaginationButton()}
    </>
  );
};

const getCellContent = (
  sale: Sale,
  id: string,
  avatars: { [buyer: string]: string }
): string | BuyerContent => {
  switch (id) {
    case 'buyer': {
      return {
        buyer: sale.buyer,
        avatar: avatars[sale.buyer],
      };
    }
    case 'price': {
      const { amount, token_precision, token_symbol } = sale.price;
      const price = `${addPrecisionDecimal(
        amount.toString(),
        token_precision
      )} ${token_symbol}`;
      return price;
    }
    case 'serial': {
      const { assets, asset_serial } = sale;
      const asset = assets[0];
      const serial = asset.template_mint;
      return asset_serial || serial;
    }
    case 'date': {
      const timeInUnix = sale.updated_at_time;
      const date = parseTimestamp(timeInUnix);
      return date;
    }
    case 'tx': {
      return sale.updated_at_block;
    }
  }
};

export default SalesHistoryTable;
