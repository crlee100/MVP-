import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';
import { isEmail } from '../../lib/email';
import { supabase } from '../../lib/supabase';

/**
 * Figma `page/Login/SignIn` (fileKey `TRPe9rr0YsxphvFjkWwaHp`, node `4628:17674`).
 * 값 대조표와 판단 근거는 `SignIn.design.md` 에 있다.
 *
 * ## `page/Login`(4628:17658) 과 다른 점은 셋뿐이다
 * `get_design_context` 를 노드 단위로 대조했다. 폭·배경·Header 설정·`Contents`
 * 패딩(40 · 20)·`Fields` 간격(64 · 40)·두 필드의 라벨과 필수 표시·placeholder 문구는
 * 전부 같다.
 *
 * 1. **타이틀이 한 줄이다.** "회원가입" 한 줄이고 `size` 는 여전히 세트 기본값 `xl` 이다
 *    — 방출된 타이포가 Login 과 같은 font/display/medium-strong 이다.
 * 2. **하단 TextButton 행이 없다.** Login 의 "아이디 · 비밀번호 찾기" 행에 대응하는
 *    노드가 이 프레임에 없다.
 * 3. **CTA 버튼이 하나이고 폭을 다 쓴다.** hierarchy=secondary 하나뿐이다.
 * 4. **아이디 필드에 보조 문구가 없다.** Login 의 아이디 필드에는 있는
 *    `TextFieldSlot/Bottom/Items`("도움말 메세지") 단이 이 프레임의 아이디 필드
 *    (`4628:17680`)에는 없다 — `get_design_context` 로 직접 확인했다.
 *
 * ## `Bottom` 두 단을 접었다
 * Figma 는 `Bottom`(4628:17682) → `Bottom`(4628:17683) → `CTA`(4628:17684) 3단인데
 * 앞의 두 단은 시각 값을 하나도 갖지 않고 자식도 하나씩이다. 패딩을 갖는 것은
 * `CTA` 하나뿐이라 한 요소로 합쳤다 (CLAUDE.md 원칙 2, `Login` 의 같은 판단).
 *
 * ## Supabase Auth 로 가입한다
 * 근거는 `Login.tsx` 의 "Supabase Auth 로 로그인한다" 절과 같다 — 같은 클라이언트,
 * 같은 이메일 판정. `signUp({ email, password })` 을 쓴다.
 *
 * ## 가입 직후 세션이 생기는지는 Supabase 프로젝트 설정에 달려 있다
 * `/auth/v1/settings` 로 이 프로젝트의 `mailer_autoconfirm` 이 `false` 임을 직접
 * 확인했다 — 이메일 확인 절차가 켜져 있다는 뜻이다. 이 값은 anon key 로 코드에서
 * 바꿀 수 없는 **서버 설정**이다(Supabase 대시보드 Authentication 에서 바꾼다).
 * 그래서 이 화면은 두 결과를 다 처리한다:
 * · `data.session` 이 있으면(자동 확인 켜짐) → 가입과 동시에 로그인된 것이므로
 *   `Login` 과 같은 목적지(`/test2` — 요청자가 확정한 로그인 후 랜딩 경로)로
 *   이동한다.
 * · 없으면(이메일 확인 필요) → 이동하지 않고, 아이디 필드 하단에 안내 문구를
 *   띄운다. 새 시각 요소를 만들지 않고 그 필드의 기존 `supporting` 슬롯을 쓴다 —
 *   이 화면의 아이디 필드는 평소 보조 문구가 없어(위 "다른 점" 4번) 자리가
 *   비어 있었다.
 *
 * ## 이미 가입된 이메일
 * Supabase 는 사용자 열거 공격을 막기 위해 이미 존재하는 이메일로 가입을 시도해도
 * 에러를 던지지 않고 성공처럼 응답할 수 있다(신원이 빈 배열인 사용자를 돌려준다).
 * 이 경우를 구분해 다른 문구를 보여주려면 그 응답 형태를 이 프로젝트에서 직접
 * 확인해야 하는데, 확인하지 않았다 — 지어내지 않는다(원칙 1). 현재는 에러가 없는
 * 모든 응답을 "성공"으로 처리한다.
 *
 * ## 에러 케이스
 * `Login.tsx` 와 같은 3종 — 빈 값 · 이메일 형식 · Supabase 에러(이번엔 회원가입
 * 실패, 예: 이미 사용 중인 이메일이 명시적 에러로 오는 경우 · 비밀번호 정책 미달).
 * 전부 아이디 또는 비밀번호 필드 하단에 그대로 노출한다 — Supabase 문구를
 * 다른 말로 바꾸지 않는다(어느 필드 문제인지 우리가 판단할 근거가 없다, 원칙 1).
 * 요청이 날아가 있는 동안(`isSubmitting`) 버튼을 잠근다.
 */
export function SignIn() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signUpInfo, setSignUpInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUpClick() {
    const trimmedId = id.trim();
    const nextIdError =
      trimmedId === '' ? '아이디를 입력해 주세요' : !isEmail(trimmedId) ? '이메일을 입력해주세요' : null;
    const nextPasswordError = password === '' ? '비밀번호를 입력해 주세요' : null;

    setIdError(nextIdError);
    setPasswordError(nextPasswordError);
    setSignUpInfo(null);
    if (nextIdError !== null || nextPasswordError !== null) return;

    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({ email: trimmedId, password });
    setIsSubmitting(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    if (data.session) {
      navigate('/test2');
      return;
    }

    setSignUpInfo('가입 확인 이메일을 보냈어요. 메일함에서 확인해 주세요.');
  }

  // 근거는 `Login.tsx` 의 같은 자리 주석과 같다 — `as const` 로 판별 유니온에 맞춘다.
  const ERROR_PROPS = { isDisabled: true, isError: true } as const;
  const idErrorProps = idError !== null ? ERROR_PROPS : {};
  const passwordErrorProps = passwordError !== null ? ERROR_PROPS : {};

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 4628:17675 */}
      <OSBarTopNavigation />

      {/* 4628:17676 — Login 과 같이 hasTitle=false 다. 화면 제목 "회원가입" 은
          Header 가 아니라 아래 TextSetTitle 이 그린다. 뒤로가기의 클릭 축은 이번
          요청 범위에 없어 열지 않았다 — Figma 에도 정의돼 있지 않다. */}
      <Header title="" hasTitle={false} />

      {/* Contents 4628:17677 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 4628:17678 — size=xl (세트 기본값). 한 줄이라 <br /> 이 없다. */}
        <TextSetTitle title="회원가입" />

        {/* Fields 4628:17679 — Login 4628:17663 과 라벨·필수 표시·placeholder 가 같다. */}
        <div className="flex w-full flex-col gap-40 pt-64">
          {/* 4628:17680 — 필수 표시 `*` 가 꺼져 있다. Login 과 달리 하단 보조 문구
              단이 이 인스턴스에 없다 (위 "다른 점" 4번 참조). */}
          <TextFieldText
            label="아이디"
            required={false}
            supporting={idError ?? signUpInfo ?? undefined}
            {...idErrorProps}
            input={{
              id: 'signin-id',
              name: 'username',
              value: id,
              placeholder: '아이디를 입력해 주세요',
              autoComplete: 'username',
              onChange: (event) => {
                setId(event.target.value);
                setIdError(null);
                setSignUpInfo(null);
              },
            }}
            onClear={() => setId('')}
          />

          {/* 4628:17681 — 필수 표시 `*` 가 켜져 있다 (`required` 기본값 그대로).
              placeholder 를 넘기지 않는 근거는 Login 과 같다 — Figma 의
              `● ● ● ● ● ●` 는 값이 채워진 필드를 그린 샘플이지 안내 문구가 아니다.
              새 계정의 비밀번호라 autoComplete 은 new-password 다. */}
          <TextFieldPassword
            label="비밀번호"
            supporting={passwordError ?? undefined}
            {...passwordErrorProps}
            input={{
              id: 'signin-password',
              name: 'new-password',
              value: password,
              autoComplete: 'new-password',
              onChange: (event) => {
                setPassword(event.target.value);
                setPasswordError(null);
              },
            }}
            onClear={() => setPassword('')}
          />
        </div>
      </div>

      {/* CTA 4628:17684 — 위 "Bottom 두 단을 접었다" 참조.
          4628:17685 하나뿐이고 폭을 다 쓴다. Figma 가 flex-grow 1 · flex-basis 0 을
          방출하고, `Button` 은 hug(inline-flex) 라서 늘리는 것은 이 호출부다.

          Supabase Auth 로 가입을 시도한다 (위 "Supabase Auth 로 가입한다" 참조). */}
      <div className="flex w-full px-20 pt-8 pb-20">
        <Button
          variant="filled-secondary"
          className="flex-1"
          isDisabled={isSubmitting}
          onClick={handleSignUpClick}
        >
          회원가입
        </Button>
      </div>

      {/* 4628:17686 */}
      <OSBarBottomNavigation />
    </div>
  );
}
