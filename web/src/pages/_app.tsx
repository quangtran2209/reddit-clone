import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'

import theme from '../theme'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      {/* According to chakra-ui issue 684: https://github.com/chakra-ui/chakra-ui/issues/684 it got fixed but it seems it doesn't so comment this out */}
      {/* <ColorModeProvider> */}
        <CSSReset />
        <Component {...pageProps} />
      {/* </ColorModeProvider> */}
    </ThemeProvider>
  )
}

export default MyApp
