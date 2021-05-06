import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import SimpleReactLightbox from 'simple-react-lightbox';
import '../styles/reset.css';
import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import {
  AuthProvider,
  ModalProvider,
  CreateAssetProvider,
} from '../components/Provider';
import '../styles/customprogress.css';
import * as gtag from '../utils/gtag';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const start = () => NProgress.start();
  const end = (url) => {
    NProgress.done();
    gtag.pageview(url);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axe = require('@axe-core/react');
      axe(React, ReactDOM, 1000);
    }
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <SimpleReactLightbox>
      <ModalProvider>
        <AuthProvider>
          <CreateAssetProvider>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </CreateAssetProvider>
        </AuthProvider>
      </ModalProvider>
    </SimpleReactLightbox>
  );
}

export default MyApp;
