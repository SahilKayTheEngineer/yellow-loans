import { ThemeProvider } from 'styled-components';
import ApplicationPage from './pages/ApplicationPage';
import { theme } from './theme';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, ${(props) => props.theme.colors.gray[50]}, ${(props) => props.theme.colors.gray[100]});
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ApplicationPage />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;

