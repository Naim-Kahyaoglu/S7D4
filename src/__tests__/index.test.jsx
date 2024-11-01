// Daha önceki import ifadelerini koruyun
import { beforeEach, expect, test } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App from '../App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import 'mutationobserver-shim';
import fs from 'fs';
import path from 'path';

const loginPage = fs
  .readFileSync(path.resolve(__dirname, '../components/Login.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  document.body.innerHTML = '';
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});

// Mevcut testler...

// Yeni test senaryoları
test('Geçersiz e-posta ile form gönderilmiyor ve hata mesajı çıkıyor', async () => {
  const user = userEvent.setup();

  const login = screen.getByText('Login');
  await user.click(login);

  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  const loginButton = screen.getByText('Sign In');

  await user.type(email, 'invalidemail');
  await user.type(password, 'StrongPassword1!');

  await user.click(loginButton);

  // Hata mesajı kontrolü
  expect(await screen.findByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument();
  expect(loginButton).toBeDisabled();
});

test('Geçersiz şifre ile form gönderilmiyor ve hata mesajı çıkıyor', async () => {
  const user = userEvent.setup();

  const login = screen.getByText('Login');
  await user.click(login);

  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  const loginButton = screen.getByText('Sign In');

  await user.type(email, 'erdem.guntay@wit.com.tr');
  await user.type(password, 'short'); // Geçersiz şifre

  await user.click(loginButton);

  // Hata mesajı kontrolü
  expect(await screen.findByText('Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.')).toBeInTheDocument();
  expect(loginButton).toBeDisabled();
});

test('Terms kabul edilmezse buton disabled kalıyor ve hata mesajı çıkıyor', async () => {
  const user = userEvent.setup();

  const login = screen.getByText('Login');
  await user.click(login);

  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  const loginButton = screen.getByText('Sign In');

  await user.type(email, 'erdem.guntay@wit.com.tr');
  await user.type(password, 'StrongPassword1!');

  // Şartları kabul etmeden butona tıklama
  await user.click(loginButton);

  expect(await screen.findByText('Şartları kabul etmelisiniz.')).toBeInTheDocument();
  expect(loginButton).toBeDisabled();
});
