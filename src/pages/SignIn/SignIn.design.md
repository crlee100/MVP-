# SignIn — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료.** `SignIn.tsx` · `SignIn.stories.tsx` 가 내려가 있고
> `npm run typecheck` · `npm run build` 를 통과했다. 미검증 항목은
> [남은 것](#남은-것) 에 적었다.

## Figma 소스

| 항목 | 값 |
|---|---|
| fileKey | `TRPe9rr0YsxphvFjkWwaHp` |
| 섹션 | `4628:17657` "로그인 & 회원가입 페이지 구현하기" |
| 프레임 | `4628:17674` — `page/Login/SignIn` 402×874 |
| 추출 | `get_metadata`(요청자 제공) · `get_screenshot` · `get_design_context`(4628:17676 · 4628:17677 · 4628:17682) · `get_variable_defs`(4628:17674) |

## 노드 구조 → 컴포넌트 매핑

**새로 만든 컴포넌트도, 새로 추가한 토큰도 없다.**

```
FRAME 4628:17674  "page/Login/SignIn"  402×874
├─ 4628:17675  OSBar/TopNavigation      → OSBarTopNavigation
├─ 4628:17676  Header                   → Header (hasTitle=false)
├─ 4628:17677  Contents                 → (레이아웃 프레임)
│  ├─ 4628:17678  TextSetTitle          → TextSetTitle (size=xl, 세트 기본값)
│  └─ 4628:17679  Fields                → (레이아웃 프레임)
│     ├─ 4628:17680  TextField/Text     → TextFieldText     (required=false, supporting 없음)
│     └─ 4628:17681  TextField/Password → TextFieldPassword (required 기본 true)
├─ 4628:17682  Bottom → 4628:17683 Bottom → 4628:17684 CTA → (레이아웃 프레임, 2단 접음)
│  └─ 4628:17685  Button                → Button variant="filled-secondary"
└─ 4628:17686  OSBar/BottomNavigation   → OSBarBottomNavigation
```

## `page/Login`(4628:17658) 과 다른 점

`get_design_context` 두 프레임을 노드 단위로 대조했다.

| | Login `4628:17658` | SignIn `4628:17674` |
|---|---|---|
| 타이틀 | 2줄 "아이디와 비밀번호를 / 입력해 주세요" | **1줄 "회원가입"** |
| 타이틀 size | `xl`(세트 기본값) | `xl`(세트 기본값, 동일) — 방출된 타이포가 같은 font/display/medium-strong |
| 하단 TextButton 행 | 있음 ("아이디 · 비밀번호 찾기") | **없음** |
| CTA | 버튼 2개(1:1 분할) | **버튼 1개**, 폭 전체 |
| 아이디 필드 보조 문구 | "도움말 메세지" 있음 | **없음** — `get_design_context(4628:17677)`에 `TextFieldSlot/Bottom/Items` 노드 자체가 없다 |

나머지(폭·배경·Header 설정·Contents 패딩·Fields 간격·두 필드의 라벨·필수 표시·
placeholder 문구)는 노드 단위로 같다.

## `Bottom` 두 단을 접은 근거

Figma 는 `Bottom`(4628:17682) → `Bottom`(4628:17683) → `CTA`(4628:17684) 3단이다.
`get_design_context`가 앞의 두 단에 방출한 클래스는 `flex flex-col items-start
w-full` 뿐이고 패딩·간격·배경이 없다. 패딩을 갖는 것은 `CTA` 하나다. 그래서 한
요소로 합쳤다 (CLAUDE.md 원칙 2, `Login` 이 `TextButton` 을 접은 것과 같은 판단).

## 값의 출처 — Figma 변수 / 기존 토큰 / 불명

| 값 | 출처 | 근거 |
|---|---|---|
| 배경·폭·Contents 패딩·Fields 간격 | Login 과 동일 | `Login.design.md` 의 같은 절 |
| 타이틀 문구 "회원가입" | `get_design_context(4628:17677)` 텍스트 노드 원문 | 콘텐츠 값 |
| 아이디 placeholder "아이디를 입력해 주세요" | `get_design_context(4628:17677)` 텍스트 노드 원문 | 콘텐츠 값, Login 과 동일 |
| 아이디 라벨 필수 표시 없음 | 라벨 content 안 텍스트 노드 1개 | 관측 사실 |
| 비밀번호 라벨 필수 표시 있음 | 라벨 content 안 텍스트 노드 2개(`*` 포함) | 관측 사실 |
| CTA 버튼 문구 "회원가입", hierarchy secondary | `get_design_context(4628:17682)` 텍스트 노드·property 원문 | 콘텐츠 값 · Figma component property |
| CTA 패딩 8·20·20 | `get_design_context(4628:17682)`가 `pb-[20px] pt-[8px] px-[20px]` 방출 | 기존 토큰 `--spacing-8`·`--spacing-20` |

**불명확한 값은 없다.**

## 사용 토큰

Login 과 완전히 같은 토큰 집합이고, **새로 추가한 토큰은 없다.**

| 토큰 | 유틸리티 | 쓰는 곳 |
|---|---|---|
| `--color-bg-secondary` | `bg-bg-secondary` | 페이지 배경 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 페이지 폭 402 |
| `--spacing-40` | `pt-40` · `gap-40` | `Contents` 상단 여백 · 필드 간 간격 |
| `--spacing-20` | `px-20` · `pb-20` | 페이지 좌우 마진 · CTA 좌우·하단 |
| `--spacing-64` | `pt-64` | 타이틀 ↔ 입력 영역 |
| `--spacing-8` | `pt-8` | CTA 상단 |

### 재사용한 컴포넌트 — 신규 컴포넌트 0개

`Button` · `Header` · `OSBarBottomNavigation` · `OSBarTopNavigation` ·
`TextFieldPassword` · `TextFieldText` · `TextSetTitle` (Login 과 달리 `TextButton`
은 쓰지 않는다 — 이 화면에 해당 노드가 없다).

## 이번 요청 범위 — Supabase·이메일 검증 없음

`Login.design.md` 와 같은 판단이다. 인증 호출·이메일 형식 검증·에러 상태 로직은
이번 범위에 없어 넣지 않았다 (원칙 1). 필요해 보이는 지점:

- 회원가입 버튼을 눌렀을 때 가입 요청을 보내고 결과를 처리하는 로직 —
  **필요하지만 이번 범위에 없음.**
- 아이디 필드의 이메일 형식 검증, 비밀번호 규칙 검사 — **필요하지만 이번 범위에 없음.**

## CTA 버튼의 이동 목적지

| 컨트롤 | 가는 곳 | 근거 |
|---|---|---|
| 회원가입 (`4628:17685`) | **없음** | 가입 완료 후 갈 화면이 이번 범위에 없다. `Login` 의 [로그인] 버튼과 같은 판단(원칙 1)으로 `onClick` 을 지어내지 않았다 |

Header 뒤로가기도 같은 이유로 클릭 축을 열지 않았다 — 이번 요청 범위에 뒤로가기
이동이 없고, Figma `4628:17676` 에도 클릭 축이 정의돼 있지 않다.

## 남은 것

| 미검증 | 왜 |
|---|---|
| 브라우저에서의 실제 타이핑 · 포커스 링 · 눈 토글 동작 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. Storybook `Pages/SignIn` 스토리로 눈으로 볼 수 있다 |
| 스크린샷 픽셀 대조 | 위와 같은 이유. `get_screenshot` 결과와 Storybook 렌더를 육안 비교했다 |
