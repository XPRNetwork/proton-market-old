import { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import {
  Container,
  Section,
  Card,
  Text,
  Subtext,
  Icon,
} from './HomepageStatistics.styled';
import { Image } from '../../styles/index.styled';
import { getStatistics } from '../../services/statistics';
import { formatThousands } from '../../utils';

type Props = {
  text: string;
  subtext: string;
  imgSrc: string;
};

const StatisticCard = ({ text, subtext, imgSrc }: Props): JSX.Element => (
  <Card>
    <Icon>
      <Image width="80px" height="auto" alt={subtext} src={imgSrc} />
    </Icon>
    <Section>
      <Text>{text}</Text>
      <Subtext>{subtext}</Subtext>
    </Section>
  </Card>
);

const HomepageStatistics = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nftsCreated, setNftsCreated] = useState<string>();
  const [transactions, setTransactions] = useState<string>();
  const [totalSales, setTotalSales] = useState<string>();
  // const [salesToday, setSalesToday] = useState<string>();
  // getting today's sale numbers currently disabled until we get more sales

  useEffect(() => {
    (async () => {
      try {
        const stats = await getStatistics();
        setNftsCreated(formatThousands(stats.nftsCreated));
        setTransactions(formatThousands(stats.transactions));
        setTotalSales(`$${formatThousands(stats.totalSales)}`);
        // setSalesToday(`$${formatThousands(stats.salesToday)}`);
      } catch (err) {
        console.warn(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const stats = [
    {
      text: nftsCreated,
      subtext: "NFT'S CREATED",
      imgSrc: '/nfts-created.svg',
    },
    {
      text: transactions,
      subtext: 'TRANSACTIONS',
      imgSrc: '/transactions.svg',
    },
    {
      text: totalSales,
      subtext: 'TOTAL SALES',
      imgSrc: '/total-sales.svg',
    },
    // {
    //   text: salesToday,
    //   subtext: 'SALES TODAY',
    //   imgSrc: '/sales-today.svg',
    // },
  ];

  return (
    <Container isLoading={isLoading}>
      {isLoading ? (
        <Spinner />
      ) : (
        stats.map((stat) => <StatisticCard {...stat} key={stat.subtext} />)
      )}
    </Container>
  );
};

export default HomepageStatistics;
