import type { Meta, StoryObj } from '@storybook/react';
import { SignIn } from './SignIn';

/** Figma `page/Login/SignIn` (fileKey TRPe9rr0YsxphvFjkWwaHp, node 4628:17674). */
const FIGMA_URL =
  'https://www.figma.com/design/TRPe9rr0YsxphvFjkWwaHp/?node-id=4628-17674';

const meta = {
  title: 'Pages/SignIn',
  component: SignIn,
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
          'Figma `page/Login/SignIn` (node 4628:17674). 회원가입 화면입니다. ' +
          '**새로 만든 컴포넌트도, 새로 추가한 토큰도 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → ' +
          '`TextSetTitle`(`size=xl`, 한 줄) → `TextFieldText`(아이디) → ' +
          '`TextFieldPassword`(비밀번호) → `Button`(`filled-secondary`, 폭 전체) → ' +
          '`OSBarBottomNavigation`.\n\n' +
          '**`Pages/Login` 과 다른 점은 넷입니다** — 타이틀이 한 줄, 하단 TextButton 행이 없음, ' +
          'CTA 가 하나이고 폭을 다 씀, 아이디 필드에 보조 문구가 없음. 나머지는 노드 단위로 ' +
          '같습니다. 근거는 `SignIn.design.md` 참조.\n\n' +
          '**두 필드는 실제로 입력됩니다.** 값은 `useState` 로 이 화면 안에서만 관리하고, ' +
          '어디에도 보내지 않습니다.\n\n' +
          '**[회원가입] 은 이동 목적지가 이번 범위에 없어 아무 동작도 하지 않습니다** — ' +
          '`Pages/Login` 의 [로그인] 버튼과 같은 판단입니다.\n\n' +
          '`<form>` 은 두지 않았습니다 — 제출 대상이 없습니다.',
      },
    },
  },
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 4628:17674 그대로. 두 필드가 비어 있는 최초 상태입니다. */
export const Default: Story = {};
