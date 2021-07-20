import { FC } from 'react';
import { useRouter } from 'next/router';
import {
  EmptyContent,
  Title,
  Subtitle,
  Button,
} from './EmptySectionContent.styled';

type Props = {
  subtitle: string;
  buttonTitle?: string;
  link?: string;
  hasTopBorder?: boolean;
};

const EmptySectionContent: FC<Props> = ({
  subtitle,
  buttonTitle = 'Explore NFTs',
  link = '/',
  hasTopBorder = false,
}) => {
  const router = useRouter();

  return (
    <EmptyContent hasTopBorder={hasTopBorder}>
      <Title>No items found</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Button onClick={() => router.push(link)}>{buttonTitle}</Button>
    </EmptyContent>
  );
};

export default EmptySectionContent;
