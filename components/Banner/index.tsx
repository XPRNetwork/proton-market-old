import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils';
import { useAuthContext, useModalContext } from '../Provider';
import { Background, Spacer, Content, Money } from './Banner.styled';

type Props = {
  toolTipContent?: string;
  modalType: string;
};

const Banner = ({ modalType }: Props): JSX.Element => {
  const { currentUser, atomicMarketBalance } = useAuthContext();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!atomicMarketBalance) return;

    const balance = parseFloat(atomicMarketBalance.replace(/[,]/g, ''));

    if (currentUser && balance > 0) {
      setIsBannerVisible(true);
    } else {
      setIsBannerVisible(false);
    }
  }, [currentUser, atomicMarketBalance]);

  return isBannerVisible ? (
    <>
      <Spacer />
      <Background onClick={() => openModal(modalType)}>
        <Content>
          <Money role="img" aria-label="Money" right>
            💸
          </Money>
          Claim {formatPrice(atomicMarketBalance)} from royalties
          <Money role="img" aria-label="Money">
            💸
          </Money>
        </Content>
      </Background>
    </>
  ) : null;
};

export default Banner;
