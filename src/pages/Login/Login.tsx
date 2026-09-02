import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextButton } from '../../components/TextButton/TextButton';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';
import { isEmail } from '../../lib/email';
import { supabase } from '../../lib/supabase';

/**
 * Figma `page/Login` (fileKey `TRPe9rr0YsxphvFjkWwaHp`, node `4628:17658`).
 * 값 대조표와 판단 근거는 `Login.design.md` 에 있다.
 *
 * ## 새로 만든 컴포넌트가 없다
 * Figma 트리의 인스턴스 7종이 `src/components` 의 컴포넌트와 1:1 로 맞는다.
 * 이 파일이 직접 그리는 것은 Figma 의 **레이아웃 프레임 4개**뿐이고
 * (`Contents` 4628:17661 · `Fields` 4628:17663 · `Bottom` 4628:17666 ·
 * `CTA` 4628:17670), 그 프레임들은 시각 값으로 패딩과 간격만 갖는다.
 *
 * ## 세로 배치는 전부 flex column 이다. 절대 좌표가 없다
 * Figma 의 y 좌표는 auto-layout 의 결과라서 옮기지 않았다. 프레임마다 선언된
 * 패딩·간격을 토큰 유틸리티로 그대로 옮기면 같은 좌표가 나온다 — `get_design_context`
 * 로 직접 확인한 값이다 (`Login.design.md` 의 "사용 토큰" 절 참조).
 *
 * ## 하단 두 버튼의 1:1 분할
 * `get_design_context(4628:17666)` 가 두 Button 인스턴스에 flex-grow 1 ·
 * flex-shrink 0 · flex-basis 0 을 그대로 방출한다. `Button` 은 Figma 의 hug 를
 * 옮겨 inline-flex 라서, 늘리는 것은 이 호출부가 `className="flex-1"` 로 지정한다.
 *
 * ## 아이디 필드에만 있는 보조 문구
 * Figma 인스턴스 `4628:17664`(아이디)는 하단에 `TextFieldSlot/Bottom/Items` 단을
 * 갖고 있고 그 안의 문구가 "도움말 메세지" 다. 비밀번호 쪽(`4628:17665`)에는 이
 * 단 자체가 없다. 지어낸 문구가 아니라 `get_design_context`·`get_screenshot`
 * 양쪽에서 확인한 값이다. 에러가 아닌 기본 상태이므로 `isError`·`isDisabled` 없이
 * `supporting` 만 넘긴다.
 *
 * ## Supabase Auth 로 로그인한다
 * `src/lib/supabase.ts` 의 클라이언트 하나를 쓴다 (요청자 지시 — 데이터 테이블
 * 대신 Supabase Auth 내장 인증을 쓰기로 확인받았다). **아이디 필드에 들어오는
 * 값은 이메일이다.** `signInWithPassword` 는 email 또는 phone 으로만 인증하고,
 * 이 화면에는 phone 필드가 없다 — `/auth/v1/settings` 로 이 프로젝트가 phone
 * 인증을 꺼 두었음을 직접 확인했다. 라벨·placeholder 는 Figma 값이라 바꾸지
 * 않았다 (원칙 3).
 *
 * ## 두 버튼의 이동 목적지
 * · [회원가입] → `/signin`. 요청이 명시한 이동이다.
 * · [로그인] → 인증 성공 시 `/test2` 로 이동한다. 요청자 지시로 확정된 값이다
 *   ("로그인하고 나면 랜딩페이지를 /test2 로 해줘").
 *
 * `<form>` 을 두지 않았다 — 두 버튼 모두 `Button` 기본값인 `type="button"` 이다.
 *
 * ## 에러 케이스 — 필수 입력 + 이메일 형식 + 인증 실패
 * `TextFieldText`·`TextFieldPassword` 가 이미 갖고 있는 `isError` 표현만 쓴다
 * (새 시각 요소를 만들지 않았다, 원칙 2). 두 컴포넌트는 `isError` 가
 * `isDisabled: true` 와만 조합되도록 타입이 막혀 있지만, 이 `isDisabled` 는
 * 색만 바꿀 뿐 실제 `<input disabled>` 를 걸지 않으므로 에러 표시 중에도 계속
 * 타이핑할 수 있다. 값을 다시 입력하기 시작하면 그 필드의 에러만 지운다.
 *
 * 1. **빈 값** — 아이디·비밀번호 각각 "…를 입력해 주세요".
 * 2. **이메일 형식 아님** — 아이디에만. 판정은 `src/lib/email.ts` 의 `isEmail`
 *    하나이고, `SignIn` 과 같은 함수를 쓴다.
 * 3. **인증 실패** — Supabase 가 돌려준 에러. 자격 증명 실패(`invalid_credentials`)만
 *    우리 문구로 바꾸고, 나머지(네트워크·설정 오류 등)는 Supabase 문구를 그대로
 *    비밀번호 필드 하단에 띄운다 — 실패를 한 문장으로 덮지 않는다 (원칙 4).
 *    아이디·비밀번호 중 어느 쪽이 틀렸는지 Supabase 가 구분해 주지 않으므로
 *    한 곳에만 띄운다.
 *
 * 요청이 날아가 있는 동안(`isSubmitting`) 두 버튼을 함께 잠근다 — 중복 제출 방지.
 */
export function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLoginClick() {
    const trimmedId = id.trim();
    const nextIdError =
      trimmedId === '' ? '아이디를 입력해 주세요' : !isEmail(trimmedId) ? '이메일을 입력해주세요' : null;
    const nextPasswordError = password === '' ? '비밀번호를 입력해 주세요' : null;

    setIdError(nextIdError);
    setPasswordError(nextPasswordError);
    if (nextIdError !== null || nextPasswordError !== null) return;

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: trimmedId, password });
    setIsSubmitting(false);

    if (error) {
      setPasswordError(
        error.code === 'invalid_credentials' ? '아이디 또는 비밀번호를 확인해 주세요' : error.message,
      );
      return;
    }

    navigate('/test2');
  }

  // `TextFieldText`·`TextFieldPassword` 의 `isError` 는 `isDisabled: true` 와만
  // 조합되는 판별 유니온이다. `as const` 로 리터럴 타입을 고정해야 조건부로
  // 스프레드해도 그 유니온에 그대로 들어맞는다 (좁혀지지 않은 `boolean` 은 안 된다).
  const ERROR_PROPS = { isDisabled: true, isError: true } as const;
  const idErrorProps = idError !== null ? ERROR_PROPS : {};
  const passwordErrorProps = passwordError !== null ? ERROR_PROPS : {};

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 4628:17659 */}
      <OSBarTopNavigation />

      {/* 4628:17660 — 이 화면은 타이틀이 없다. Figma 인스턴스가 hasTitle=false 다.
          `title` 은 Header 의 필수 prop 이라 값을 비워 넘긴다 — hasTitle=false 면
          렌더되지 않는 자리다. Header 의 타입을 이 화면 때문에 고치지 않았다 (원칙 3). */}
      <Header title="" hasTitle={false} />

      {/* Contents 4628:17661 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 4628:17662 — size=xl (세트 기본값). 두 줄로 끊긴 것은 Figma 텍스트 노드의
            내용이고 컴포넌트 속성이 아니라서 (`TextSetTitle.tsx` 의 "넣지 않은 것" 절)
            줄바꿈을 여기서 넣는다. */}
        <TextSetTitle
          title={
            <>
              아이디와 비밀번호를
              <br />
              입력해 주세요
            </>
          }
        />

        {/* Fields 4628:17663 */}
        <div className="flex w-full flex-col gap-40 pt-64">
          {/* 4628:17664 — 필수 표시 `*` 가 꺼져 있다 (라벨 content 안 텍스트 노드 1개).
              하단 보조 문구 "도움말 메세지" 는 Figma 인스턴스에 실재하는 값이다. */}
          <TextFieldText
            label="아이디"
            required={false}
            supporting={idError ?? '도움말 메세지'}
            {...idErrorProps}
            input={{
              id: 'login-id',
              name: 'username',
              value: id,
              // 4628:17664 문구가 그대로 placeholder 다 (변수 text/disabled-onLight).
              placeholder: '아이디를 입력해 주세요',
              autoComplete: 'username',
              onChange: (event) => {
                setId(event.target.value);
                setIdError(null);
              },
            }}
            onClear={() => setId('')}
          />

          {/* 4628:17665 — 필수 표시 `*` 가 켜져 있다 (`required` 기본값 그대로).
              placeholder 를 넘기지 않는 이유: Figma 의 `● ● ● ● ● ●` 는 값이 채워진
              필드를 그린 샘플이지 안내 문구가 아니다. 대신할 문구가 Figma 에 없어
              지어내지 않았다 (원칙 1). */}
          <TextFieldPassword
            label="비밀번호"
            supporting={passwordError ?? undefined}
            {...passwordErrorProps}
            input={{
              id: 'login-password',
              name: 'password',
              value: password,
              autoComplete: 'current-password',
              onChange: (event) => {
                setPassword(event.target.value);
                setPasswordError(null);
              },
            }}
            onClear={() => setPassword('')}
          />
        </div>
      </div>

      {/* Bottom 4628:17666 */}
      <div className="flex w-full flex-col">
        {/* Text Button 4628:17667 */}
        <div className="flex w-full items-center justify-center py-20">
          {/* 4628:17668 — color 는 기본값 secondary 다 (Figma 변수 text/secondary). */}
          <TextButton>아이디 · 비밀번호 찾기</TextButton>
        </div>

        {/* Bottom 4628:17669 → CTA 4628:17670 */}
        <div className="flex w-full gap-8 px-20 pt-8 pb-20">
          {/* 4628:17671 — hierarchy=secondary.
              회원가입 화면(`page/Login/SignIn` 4628:17674)으로 넘어간다. 요청 범위가
              명시한 이동이다. Figma 에는 두 프레임을 잇는 프로토타입 연결이 없어
              이동 자체는 Figma 근거가 아니라 요청 근거다. */}
          <Button
            variant="filled-secondary"
            className="flex-1"
            isDisabled={isSubmitting}
            onClick={() => navigate('/signin')}
          >
            회원가입
          </Button>
          {/* 4628:17672 — hierarchy=primary (Button 의 기본값이지만, 두 버튼이 나란히
              있어 서로의 대비가 읽는 사람에게 의미를 갖는 자리라 명시한다).

              Supabase Auth 로 로그인을 시도한다 (위 "Supabase Auth 로 로그인한다" 참조). */}
          <Button
            variant="filled-primary"
            className="flex-1"
            isDisabled={isSubmitting}
            onClick={handleLoginClick}
          >
            로그인
          </Button>
        </div>
      </div>

      {/* 4628:17673 */}
      <OSBarBottomNavigation />
    </div>
  );
}
