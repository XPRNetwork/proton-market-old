import { useState, useEffect, FC } from 'react';
import Tooltip from '../Tooltip';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
  TransparentBackground,
} from './AssetFormPopupMenu.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import {
  useModalContext,
  useAuthContext,
  MODAL_TYPES,
  MintAssetModalProps,
} from '../Provider';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';
import proton from '../../services/proton-rpc';

type Props = {
  setCurrentAssetAsModalProps?: () => void;
  assetIds?: string[];
  saleIds?: string[];
  isTemplateCreator?: boolean;
  isMyTemplate: boolean;
  isRefetchingAssets?: boolean;
};

const AssetFormPopupMenu: FC<Props> = ({
  setCurrentAssetAsModalProps,
  assetIds,
  saleIds,
  isTemplateCreator,
  isMyTemplate,
  isRefetchingAssets,
}) => {
  const { currentUser } = useAuthContext();
  const actor = currentUser ? currentUser.actor : '';
  const { openModal, modalProps, setModalProps } = useModalContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalWithFeeOpen, setIsModalWithFeeOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  const [accountRam, setAccountRam] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  useEffect(() => {
    (async () => {
      const { max, used } = await proton.getAccountRam(actor);
      const rate = await proton.getXPRtoXUSDCConversionRate();
      setAccountRam(max - used);
      setConversionRate(rate);
    })();
  }, [actor, isModalWithFeeOpen]);

  const isMintAssetModalHidden = (): boolean => {
    if (!modalProps) return true;
    const { maxSupply, issuedSupply } = modalProps as MintAssetModalProps;
    const hasMintedMaxSupply =
      maxSupply && issuedSupply && maxSupply === issuedSupply;
    return !isTemplateCreator || hasMintedMaxSupply;
  };

  const popupMenuItems = [
    {
      isHidden: !isMyTemplate || !assetIds || assetIds.length === 0,
      name: 'Mark all for sale',
      tooltip: isRefetchingAssets
        ? {
            text:
              'Currently unable to mark all for sale while processing newly minted assets.',
            numberOfLines: 3.25,
          }
        : undefined,
      onClick: isRefetchingAssets
        ? null
        : () => {
            setIsOpen(false);
            setIsModalWithFeeOpen(true);
            openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
            setModalProps((previousModalProps) => ({
              ...previousModalProps,
              accountRam,
              conversionRate,
              setIsModalWithFeeOpen,
            }));
          },
    },
    {
      isHidden: !isMyTemplate || isMintAssetModalHidden(),
      name: 'Mint more assets',
      onClick: () => {
        setIsOpen(false);
        setIsModalWithFeeOpen(true);
        openModal(MODAL_TYPES.MINT_ASSET);
        setModalProps((previousModalProps) => ({
          ...previousModalProps,
          accountRam,
          conversionRate,
          setIsModalWithFeeOpen,
        }));
      },
    },
    {
      isHidden: !isMyTemplate || assetIds.length === 0,
      name: 'Transfer NFT',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.TRANSFER);
        setCurrentAssetAsModalProps();
      },
    },
    {
      isHidden: !isMyTemplate || assetIds.length === 0,
      name: 'Burn NFT',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.BURN_ASSET);
        setCurrentAssetAsModalProps();
      },
    },
    {
      isHidden: !isMyTemplate || !saleIds || saleIds.length === 0,
      name: 'Cancel all sales',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CANCEL_MULTIPLE_SALES);
      },
    },
  ];

  return (
    <MenuContainer>
      <PopupMenuButton onClick={togglePopupMenu}>
        <Ellipsis />
      </PopupMenuButton>
      <Menu isOpen={isOpen}>
        {popupMenuItems.map(({ isHidden, name, tooltip, onClick }) => {
          if (!isHidden) {
            const menuItemContent = tooltip ? (
              <Tooltip
                text={tooltip.text}
                numberOfLines={tooltip.numberOfLines}
                isLeftAlignedToParent>
                {name}
              </Tooltip>
            ) : (
              name
            );

            return (
              <MenuItem key={name} tabIndex={0} onClick={onClick}>
                {menuItemContent}
              </MenuItem>
            );
          }
        })}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

export default AssetFormPopupMenu;
