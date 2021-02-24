import {
  ColorModeProvider,
  CSSReset,
  ThemeProvider
} from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider options={pageProps}>
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default MyApp;
