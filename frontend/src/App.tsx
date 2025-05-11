import AppRouter from './router/AppRouter';
import LoginPage from '../src/features/auth/pages/LoginPage';

export default function App() {
  return <>
    <LoginPage></LoginPage>
    <AppRouter />
  
  </>;
}
