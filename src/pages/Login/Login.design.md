# Login — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료.** `Login.tsx` · `Login.stories.tsx` 가 내려가 있고
> `npm run typecheck` · `npm run build` 를 통과했다. 미검증 항목은 맨 아래
> [남은 것](#남은-것) 에 적었다.

## Figma 소스

| 항목 | 값 |
|---|---|
| fileKey | `TRPe9rr0YsxphvFjkWwaHp` |
| 섹션 | `4628:17657` "로그인 & 회원가입 페이지 구현하기" |
| 프레임 | `4628:17658` — `page/Login` 402×874 |
| 추출 | `get_metadata`(요청자 제공) · `get_screenshot` · `get_design_context`(4628:17660 · 4628:17661 · 4628:17666) · `get_variable_defs`(4628:17658) |

## 노드 구조 → 컴포넌트 매핑

**새로 만든 컴포넌트는 없다.** 인스턴스 7종이 `src/components` 와 1:1 로 맞는다.

```
FRAME 4628:17658  "page/Login"  402×874
├─ 4628:17659  OSBar/TopNavigation      → OSBarTopNavigation
├─ 4628:17660  Header                   → Header (hasTitle=false)
├─ 4628:17661  Contents                 → (레이아웃 프레임)
│  ├─ 4628:17662  TextSetTitle          → TextSetTitle (size=xl, 세트 기본값)
│  └─ 4628:17663  Fields                → (레이아웃 프레임)
│     ├─ 4628:17664  TextField/Text     → TextFieldText     (required=false, supporting 있음)
│     └─ 4628:17665  TextField/Password → TextFieldPassword (required 기본 true)
├─ 4628:17666  Bottom                   → (레이아웃 프레임)
│  ├─ 4628:17667  Text Button           → (레이아웃 프레임)
│  │  └─ 4628:17668  TextButton         → TextButton
│  └─ 4628:17669 → 4628:17670  CTA      → (레이아웃 프레임)
│     ├─ 4628:17671  Button             → Button variant="filled-secondary"
│     └─ 4628:17672  Button             → Button variant="filled-primary" (기본값)
└─ 4628:17673  OSBar/BottomNavigation   → OSBarBottomNavigation
```

## 값의 출처 — Figma 변수 / 기존 토큰 / 불명

| 값 | 출처 | 근거 |
|---|---|---|
| 배경 `#fcfcfc` | Figma 변수 `bg/secondary` | `get_variable_defs` → 기존 토큰 `--color-bg-secondary` |
| 폭 402 | Figma 변수 없음, 실측 고정 폭 | `OSBarTopNavigation`·`Header`·`OSBarBottomNavigation` 이 이미 `--spacing-mobile-frame-width` 로 고정 |
| Contents 패딩 top 40 / left·right 20 | `get_design_context(4628:17661)`가 `pt-[40px] px-[20px]` 방출 | 기존 토큰 `--spacing-40`·`--spacing-20` |
| Fields 패딩 top 64 · gap 40 | `get_design_context(4628:17661)`가 `pt-[64px] gap-[40px]` 방출 | 기존 토큰 `--spacing-64`·`--spacing-40` |
| Text Button 행 padding-y 20, 가운데 정렬 | `get_design_context(4628:17666)`가 `py-[20px] justify-center` 방출 | 기존 토큰 `--spacing-20` |
| CTA 패딩 8·20·20, gap 8 | `get_design_context(4628:17666)`가 `gap-[8px] pb-[20px] pt-[8px] px-[20px]` 방출 | 기존 토큰 `--spacing-8`·`--spacing-20` |
| 타이틀 문구 "아이디와 비밀번호를 / 입력해 주세요" | `get_design_context(4628:17661)` 텍스트 노드 원문 | 콘텐츠 값 (토큰 아님) |
| 아이디 placeholder "아이디를 입력해 주세요" | `get_design_context(4628:17661)` 텍스트 노드 원문 | 콘텐츠 값 |
| 아이디 라벨 필수 표시 없음 | `get_design_context(4628:17661)`의 라벨 content 안 텍스트 노드가 1개뿐(`*` 없음) | 관측 사실 |
| 비밀번호 라벨 필수 표시 있음 | 같은 라벨 content 안 텍스트 노드 2개(`*` 포함, 색 `text/brand`) | 관측 사실 |
| 아이디 필드 보조 문구 "도움말 메세지" | `get_design_context(4628:17661)`의 `TextFieldSlot/Bottom/Items` 노드 원문. `get_screenshot`으로 시각 확인 | 콘텐츠 값 — 비밀번호 쪽에는 이 노드 자체가 없다 |
| TextButton 문구 "아이디 · 비밀번호 찾기" | `get_design_context(4628:17666)` 텍스트 노드 원문 | 콘텐츠 값 |
| 두 버튼 문구 "회원가입" · "로그인" | `get_design_context(4628:17666)` 텍스트 노드 원문 | 콘텐츠 값 |
| 두 버튼 hierarchy secondary·primary | `get_design_context(4628:17666)`가 각각 `hierarchy="secondary"`(회원가입) 방출, 로그인은 `hierarchy` 미지정(세트 기본값 primary) | Figma component property |
| 두 버튼 1:1 분할 | `get_design_context(4628:17666)`가 두 Button 인스턴스에 flex-grow 1 · flex-shrink 0 · flex-basis 0 방출 | 관측 사실 |

**불명확한 값은 없다.** 4단계 Clarify 조건(불명 0건)을 충족한다.

## 사용 토큰

| 토큰 | 유틸리티 | 쓰는 곳 |
|---|---|---|
| `--color-bg-secondary` | `bg-bg-secondary` | 페이지 배경 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 페이지 폭 402 |
| `--spacing-40` | `pt-40` · `gap-40` | `Contents` 상단 여백 · `Fields` 필드 간 간격 |
| `--spacing-20` | `px-20` · `py-20` · `px-20`(CTA) · `pb-20` | 페이지 좌우 마진 · TextButton 행 · CTA 좌우·하단 |
| `--spacing-64` | `pt-64` | 타이틀 ↔ 입력 영역 |
| `--spacing-8` | `gap-8` · `pt-8` | 두 CTA 버튼 사이 · CTA 상단 |

`spacing.tokens.css` 의 주석이 이 값들을 직접 지목한다 — `--spacing-40` *"콘텐츠 시작
여백 · 필드 간 간격"*, `--spacing-64` *"타이틀 ↔ 입력 영역 간격"*, `--spacing-8`
*"CTA 상단 여백 · 버튼 간격"*, `--spacing-20` *"페이지 좌우 마진 · CTA 하단"*.
**새로 추가한 토큰은 없다.**

### 재사용한 컴포넌트 — 신규 컴포넌트 0개

`src/components` grep 결과 아래 7개가 전부 존재해 재사용했다.

`Button` · `Header` · `OSBarBottomNavigation` · `OSBarTopNavigation` · `TextButton` ·
`TextFieldPassword` · `TextFieldText` · `TextSetTitle`

### 토큰이 아닌 클래스

| 클래스 | 왜 토큰이 아닌가 |
|---|---|
| `min-h-dvh` | 뷰포트 상대 단위. 874 는 기기 화면 높이라 컴포넌트가 정할 값이 아니다 |
| `flex-1` | `Contents` 의 남는 공간을 채우는 배분 결과. 제약 값이 아니다 |
| `flex` `flex-col` `w-full` `items-*` `justify-*` | 레이아웃 동작. 시각 값이 아니다 |

## 이번 요청 범위 — Supabase·이메일 검증 없음

요청자 지시: "토큰·컴포넌트 기반으로 화면을 붙이고 싶다." 인증 호출·이메일 형식
검증·에러 상태 로직은 이번 요청에 없다 (원칙 1). 필요해 보이는 지점이 있었으나
넣지 않았다:

- 로그인 버튼을 눌렀을 때 자격 증명을 검사하고 인증 서버에 요청을 보내는 로직 —
  **필요하지만 이번 범위에 없음.**
- 아이디 필드의 이메일 형식 검증, 빈 값 검사 — **필요하지만 이번 범위에 없음.**

두 필드는 `useState` 로 제어되는 실제 `<input>` 이고, 값은 컴포넌트 내부에만 있다.

## 두 버튼의 이동 목적지

| 컨트롤 | 가는 곳 | 근거 |
|---|---|---|
| 회원가입 (`4628:17671`) | `/signin` | 요청 범위가 명시한 이동. Figma 프로토타입 연결은 없다 — 이동 자체는 요청 근거다 |
| 로그인 (`4628:17672`) | **없음** | 로그인 성공·실패 후 갈 화면이 이번 범위에 없다. `onClick` 을 지어내지 않았다 (원칙 1) |

## 남은 것

| 미검증 | 왜 |
|---|---|
| 브라우저에서의 실제 타이핑 · 포커스 링 · 눈 토글 동작 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. Storybook `Pages/Login` 스토리로 눈으로 볼 수 있다 |
| 스크린샷 픽셀 대조 | 위와 같은 이유. `get_screenshot` 결과와 Storybook 렌더를 육안 비교했다 |
