import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login/Login';
import { SignIn } from './pages/SignIn/SignIn';
import { Test2 } from './pages/Test2/Test2';
import './index.css';

/**
 * 라우팅은 여기 한 곳에만 있다.
 *
 * `/` 로 들어오면 `/login` 으로 리다이렉트한다 — 로그인이 기본 진입점이다.
 * 하네스 랜딩(`App.tsx`)은 `/harness` 에 그대로 남아 있다.
 * 화면이 늘면 이 표에 `<Route>` 를 한 줄 더한다.
 *
 * `/test2` — `docs/prd/2026-09-02-list-tab-selection.md` (리스트/탭 선택 페이지, 혜택 선택).
 * `/login` · `/signin` — Figma `TRPe9rr0YsxphvFjkWwaHp` 노드 `4628:17658` · `4628:17674`.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/harness" element={<App />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
