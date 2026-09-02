import type { Meta, StoryObj } from '@storybook/react';
import { Login } from './Login';

/** Figma `page/Login` (fileKey TRPe9rr0YsxphvFjkWwaHp, node 4628:17658). */
const FIGMA_URL =
  'https://www.figma.com/design/TRPe9rr0YsxphvFjkWwaHp/?node-id=4628-17658';

const meta = {
  title: 'Pages/Login',
  component: Login,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `page/Login` (node 4628:17658). `src/components` 의 컴포넌트 8종을 조립한 ' +
          '화면입니다. **새로 만든 컴포넌트는 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → `TextSetTitle`(`size=xl`) → ' +
          '`TextFieldText`(아이디, 보조 문구 있음) → `TextFieldPassword`(비밀번호) → `TextButton` → ' +
          '`Button` × 2 → `OSBarBottomNavigation`.\n\n' +
          '**두 필드는 실제로 입력됩니다.** 값은 `useState` 로 이 화면 안에서만 관리하고, ' +
          '어디에도 보내지 않습니다 — 이번 범위는 인증 연동이 아니라 화면 조립입니다.\n\n' +
          '**아이디 라벨에는 `*` 가 없고 비밀번호에는 있습니다.** Figma 인스턴스가 필수 표시 ' +
          '노드를 끈 것을 `required={false}` 로 옮긴 것입니다. 아이디 필드 하단의 "도움말 메세지" ' +
          '는 Figma 인스턴스에 실재하는 값입니다 — 비밀번호 쪽에는 없습니다. 근거는 ' +
          '`Login.design.md` 참조.\n\n' +
          '**[회원가입] 은 `/signin` 으로 이동합니다.** 요청 범위가 명시한 이동입니다. ' +
          '**[로그인] 은 이동 목적지가 이번 범위에 없어 아무 동작도 하지 않습니다.**\n\n' +
          '`<form>` 은 두지 않았습니다 — 제출 대상이 없습니다.',
      },
    },
  },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 4628:17658 그대로. 두 필드가 비어 있는 최초 상태입니다. */
export const Default: Story = {};
