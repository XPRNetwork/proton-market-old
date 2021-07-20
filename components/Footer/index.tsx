import { Image } from '../../styles/index.styled';
import {
  ImageContainer,
  StyledFooter,
  Section,
  FooterLink,
} from './Footer.styled';

const links = [
  {
    name: 'Open Source',
    url: 'https://github.com/ProtonProtocol/proton-market-template',
  },
  {
    name: 'Give Us Feedback',
    url: 'https://t.me/protonnft',
  },
  {
    name: 'Terms of Service',
    url: 'https://www.protonchain.com/terms',
  },
  {
    name: 'Privacy',
    url: 'https://www.protonchain.com/terms#privacy-policy',
  },
  {
    name: 'Help',
    url: 'https://support.protonchain.com/support/home',
  },
];

const Footer = (): JSX.Element => {
  return (
    <StyledFooter>
      <ImageContainer>
        <Image width="143px" height="32px" alt="logo" src="/logo@3x.png" />
      </ImageContainer>
      <Section>
        {links.map(({ name, url }) => (
          <FooterLink key={name} href={url} target="_blank" rel="noreferrer">
            {name}
          </FooterLink>
        ))}
      </Section>
    </StyledFooter>
  );
};

export default Footer;
