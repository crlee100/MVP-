import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { ListRadio } from '../../components/ListRadio/ListRadio';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { Tab } from '../../components/Tab/Tab';

/**
 * `docs/prd/2026-09-02-list-tab-selection.md` P1 — 실제 혜택 카테고리·항목 데이터가
 * 없어 확정되지 않았다("확인 필요"). 실제 상품/혜택명을 지어내지 않기 위해 PRD가
 * 직접 제시한 자리표시자 형식("카테고리 A/B/C")을 그대로 쓴다 (CLAUDE.md 원칙 1).
 * 실제 혜택 데이터가 정해지면 이 상수만 교체한다.
 */
const CATEGORIES = [
  { label: '혜택 카테고리 A', value: 'A' },
  { label: '혜택 카테고리 B', value: 'B' },
  { label: '혜택 카테고리 C', value: 'C' },
] as const;

type BenefitCategory = (typeof CATEGORIES)[number]['value'];

interface Benefit {
  id: string;
  name: string;
  category: BenefitCategory;
}

/** 목업이다 — 실제 혜택명이 정해지지 않아 카테고리마다 다르다는 것만 보여준다. */
const MOCK_BENEFITS: readonly Benefit[] = [
  { id: 'benefit-a-1', name: '혜택 카테고리 A - 항목 1', category: 'A' },
  { id: 'benefit-a-2', name: '혜택 카테고리 A - 항목 2', category: 'A' },
  { id: 'benefit-a-3', name: '혜택 카테고리 A - 항목 3', category: 'A' },
  { id: 'benefit-b-1', name: '혜택 카테고리 B - 항목 1', category: 'B' },
  { id: 'benefit-b-2', name: '혜택 카테고리 B - 항목 2', category: 'B' },
  { id: 'benefit-c-1', name: '혜택 카테고리 C - 항목 1', category: 'C' },
  { id: 'benefit-c-2', name: '혜택 카테고리 C - 항목 2', category: 'C' },
];

/**
 * `docs/prd/2026-09-02-list-tab-selection.md` — 리스트/탭 선택 페이지 (혜택 선택).
 *
 * 구조는 과거 `src/pages/Benefit`(요금제 선택, 커밋 `dd5de09`에서 제거)의 선례를
 * 그대로 따르되, 콘텐츠는 PRD가 확정한 대로 "혜택 선택"이다. 신규 컴포넌트는
 * 만들지 않았다 — PRD P0가 지정한 기존 5개 컴포넌트(`Header` · `Tab` · `ListRadio` ·
 * `OSBarTopNavigation` · `OSBarBottomNavigation` · `Button`)만 조립했다.
 *
 * PRD가 아직 "확인 필요"로 남긴 항목은 구현하지 않거나 PRD가 제시한 안전한 기본값을
 * 그대로 썼다:
 * · 실제 혜택 콘텐츠 → 위 자리표시자 목업
 * · OSBar variant → 선례와 같은 기본값(`transparent=false, onFrameHigh=false`)
 * · '선택 완료' 이후 이동 → 목적지 화면이 이 저장소에 없어 활성/비활성 전환까지만 구현
 * · 빈 상태·로딩·에러 상태 → 근거가 없어 만들지 않음
 *
 * ## 라디오 그룹의 의미론은 이 페이지가 갖는다
 * `ListRadio`는 시각 표현만 제공하고 `role="radio"` · `aria-checked` · 그룹핑 ·
 * 키보드 조작은 호스트 책임이라고 선언한다 (`ListRadio.tsx`). 그 계약대로 여기서
 * `role="radiogroup"` + roving tabindex + 화살표/Space 키를 구현한다.
 */
export function Test2() {
  const navigate = useNavigate();

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);

  const groupRef = useRef<HTMLDivElement>(null);

  const category = CATEGORIES[categoryIndex].value;
  const benefits = MOCK_BENEFITS.filter((benefit) => benefit.category === category);
  const selectedIndex = benefits.findIndex((benefit) => benefit.id === selectedBenefitId);

  /** 탭을 바꾸면 이전 탭의 선택은 초기화된다 — 다른 카테고리의 항목을 선택 상태로 남기지 않는다. */
  function handleCategorySelect(index: number) {
    setCategoryIndex(index);
    setSelectedBenefitId(null);
  }

  function focusRow(index: number) {
    groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    const step =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;

    if (step !== 0) {
      event.preventDefault();
      const next = (index + step + benefits.length) % benefits.length;
      setSelectedBenefitId(benefits[next].id);
      focusRow(next);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      setSelectedBenefitId(benefits[index].id);
    }
  }

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      <OSBarTopNavigation />

      <Header title="혜택 선택" onSlotStartClick={() => navigate(-1)} />

      <Tab
        items={CATEGORIES.map((item) => item.label)}
        selectedIndex={categoryIndex}
        onSelect={handleCategorySelect}
      />

      <div className="flex flex-1 flex-col items-start px-20 pt-32">
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={`${CATEGORIES[categoryIndex].label} 혜택`}
          className="flex w-full flex-col"
        >
          {benefits.map((benefit, index) => (
            <ListRadio
              key={benefit.id}
              isChecked={benefit.id === selectedBenefitId}
              title={benefit.name}
              role="radio"
              aria-checked={benefit.id === selectedBenefitId}
              tabIndex={index === (selectedIndex === -1 ? 0 : selectedIndex) ? 0 : -1}
              onClick={() => setSelectedBenefitId(benefit.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex w-full px-20 pt-8 pb-20">
          <Button
            variant="filled-primary"
            className="flex-1"
            isDisabled={selectedBenefitId === null}
          >
            선택 완료
          </Button>
        </div>
      </div>

      <OSBarBottomNavigation />
    </div>
  );
}
