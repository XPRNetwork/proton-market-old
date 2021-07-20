import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Image } from '../../styles/index.styled';
import TableDataCell from '../TableDataCell';
import AvatarIcon from '../AvatarIcon';
import { ImageDataCell } from './SalesHistoryTableCell.styled';

export type BuyerContent = {
  avatar: string;
  buyer: string;
};

type Props = {
  id: string;
  content: string | BuyerContent;
};

const SalesHistoryTableCell = ({ id, content }: Props): JSX.Element => {
  const [isOnHover, setIsOnHover] = useState<boolean>(false);
  const router = useRouter();
  const addHoverState = () => setIsOnHover(true);
  const removeHoverState = () => setIsOnHover(false);
  switch (id) {
    case 'buyer': {
      const { avatar, buyer } = content as BuyerContent;
      const navigateToBuyer = () => router.push(`/user/${buyer}`);
      return (
        <>
          <ImageDataCell
            onMouseEnter={addHoverState}
            onMouseLeave={removeHoverState}
            onClick={navigateToBuyer}>
            <AvatarIcon avatar={avatar} size="32px" margin={'0 0 0 10px'} />
          </ImageDataCell>
          <TableDataCell
            color={isOnHover ? '#752eeb' : '#1a1a1a'}
            onMouseEnter={addHoverState}
            onMouseLeave={removeHoverState}
            onClick={navigateToBuyer}>
            {buyer}
          </TableDataCell>
        </>
      );
    }
    case 'serial': {
      return <TableDataCell>#{content}</TableDataCell>;
    }
    case 'tx': {
      return (
        <ImageDataCell align="left">
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}${content}`}
            passHref>
            <a target="_blank" rel="noreferrer">
              <Image width="24px" height="24px" src="/launch.svg" />
            </a>
          </Link>
        </ImageDataCell>
      );
    }
    default: {
      return content ? <TableDataCell>{content}</TableDataCell> : null;
    }
  }
};

export default SalesHistoryTableCell;
