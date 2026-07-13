import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useExcuseStore } from "../../store/useExcuseStore";

const targetLabels = {
  TEACHER: "선생님",
  PARENT: "부모님",
  FRIEND: "친구",
  LOVER: "연인",
  TEAM_LEAD: "팀장",
  TEAM_MEMBER: "팀원",
};

const toneLabels = {
  MILD: "순한맛",
  SLICK: "능글맞은맛",
  DESPERATE: "목숨 걸기",
  BULLSHIT: "개소리 모드",
};

const suspicionClassNames = {
  LOW: "bg-suspicion-low-bg text-suspicion-low-text",
  MEDIUM: "bg-suspicion-medium-bg text-suspicion-medium-text",
  HIGH: "bg-suspicion-high-bg text-suspicion-high-text",
};

function formatDateTime(value) {
  if (!value) return "방금 전";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "방금 전";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function MetricCard({ label, children }) {
  return (
    <div className="py-3 bg-surface-soft rounded-md text-center">
      <dt className="text-[11px] font-normal text-navy-500">{label}</dt>
      <dd className="mt-0.5 text-lg font-bold text-brand-primary">{children}</dd>
    </div>
  );
}

function BulletList({ items, color = "bg-brand-primary", emptyText }) {
  if (!items?.length) {
    return <p className="text-sm font-normal text-navy-500">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm font-normal text-navy-700">
          <span className={`mt-1.5 w-1.5 h-1.5 ${color} rounded-full shrink-0`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function AftermathTimeline({ aftermath }) {
  if (!aftermath?.length) {
    return (
      <p className="mt-4 text-sm font-normal text-navy-500">
        아직 예측된 후폭풍이 없어요.
      </p>
    );
  }

  return (
    <table className="mt-4 w-full">
      <caption className="sr-only">시점별 예상 질문과 붕괴 확률</caption>
      <thead>
        <tr className="text-left text-[11px] font-normal text-navy-300">
          <th scope="col" className="pb-2 font-normal">시점</th>
          <th scope="col" className="pb-2 font-normal">예상 질문</th>
          <th scope="col" className="pb-2 font-normal text-right">붕괴 확률</th>
        </tr>
      </thead>
      <tbody>
        {aftermath.map((item) => (
          <tr key={`${item.when}-${item.question}`} className="border-t border-border-soft">
            <td className="py-3 pr-3 align-top text-xs font-bold text-brand-primary whitespace-nowrap">
              {item.when}
            </td>
            <td className="py-3 pr-3 align-top text-sm font-normal text-navy-900">
              "{item.question}"
            </td>
            <td className="py-3 align-top">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-bold text-brand-primary">{item.collapseRate}%</span>
              </div>
              <div
                className="mt-1.5 h-2 w-24 ml-auto bg-border-soft rounded-md overflow-hidden"
                role="progressbar"
                aria-valuenow={item.collapseRate}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-brand-primary" style={{ width: `${item.collapseRate}%` }} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ExcuseResultPage() {
  const latestExcuse = useExcuseStore((state) => state.latestExcuse);
  const getStoredLatestExcuse = useExcuseStore((state) => state.getStoredLatestExcuse);
  const [notice, setNotice] = useState("");

  // Zustand 상태는 새로고침하면 비어질 수 있다.
  // 그래서 /create에서 같이 저장해둔 sessionStorage 값을 한 번 더 읽어 결과를 복구한다.
  const excuse = useMemo(
    () => latestExcuse ?? getStoredLatestExcuse(),
    [latestExcuse, getStoredLatestExcuse],
  );

  if (!excuse) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center bg-white">
        <p className="text-sm font-medium text-brand-primary">생성된 변명이 없습니다</p>
        <h1 className="mt-2 text-2xl font-bold text-navy-950">먼저 변명을 만들어주세요</h1>
        <p className="mt-3 text-sm text-navy-500">
          결과 화면은 방금 생성한 변명 데이터를 기준으로 보여줘요.
        </p>
        <Link
          to="/create"
          className="mt-8 inline-flex px-6 py-3 text-base font-bold text-white bg-brand-primary rounded-md hover:bg-brand-primary-hover transition-colors"
        >
          변명 만들러 가기
        </Link>
      </main>
    );
  }

  const analysis = excuse.analysis ?? {};
  const targetLabel = targetLabels[excuse.target] ?? excuse.target;
  const toneLabel = toneLabels[excuse.tone] ?? excuse.tone;
  const suspicionLevel = analysis.suspicionLevel ?? "MEDIUM";
  const roundNumber = excuse.roundNumber ?? 1;

  function showPendingFeature(message) {
    setNotice(message);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-white">
      <Link to="/create" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-brand-primary transition-colors">
        <span aria-hidden="true">&larr;</span> 다시 만들기
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-navy-950">변명 결과</h1>

      {notice && (
        <p role="status" className="mt-4 inline-block text-sm font-medium text-brand-primary bg-brand-primary-soft rounded-md px-3.5 py-2.5">
          {notice}
        </p>
      )}

      <section aria-label="생성된 변명" className="mt-6 bg-surface-soft rounded-lg p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-normal text-navy-300">
            <span>상황: {excuse.situation ?? "방금 만든 위기 상황"}</span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 text-[11px] font-medium text-brand-primary bg-brand-primary-soft rounded-md">
              {targetLabel} · {toneLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>생성 시각 {formatDateTime(excuse.createdAt)}</span>
          </div>
          <span className="shrink-0 px-2.5 py-1 text-xs font-bold text-brand-primary bg-brand-primary-soft rounded-md whitespace-nowrap">
            {roundNumber} / 5 라운드
          </span>
        </div>

        <blockquote className="mt-4 text-xl sm:text-2xl font-medium text-navy-950 leading-snug border-l-4 border-brand-primary pl-4 sm:pl-5">
          "{excuse.excuse}"
        </blockquote>

        <div className="mt-5 pt-5 border-t border-border-soft flex items-center justify-between">
          <p className="text-sm font-medium text-navy-500">획득 경험치</p>
          <strong className="text-base font-bold text-brand-primary">+{excuse.earnedXp ?? 0} XP</strong>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        <div className="border border-border-soft rounded-lg">
          <div className="p-6 sm:p-8">
            <h2 className="text-base font-bold text-navy-950">변명 분석 리포트</h2>

            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="성공(생존) 확률">{analysis.successRate ?? 0}%</MetricCard>
              <MetricCard label="현실성">{analysis.realism ?? 0} / 5</MetricCard>
              <MetricCard label="설득력">{analysis.persuasion ?? 0} / 5</MetricCard>
              <div className="py-3 bg-surface-soft rounded-md text-center">
                <dt className="text-[11px] font-normal text-navy-500">의심 위험도</dt>
                <dd className="mt-0.5">
                  <span className={`inline-block px-2.5 py-1 text-sm font-bold rounded-md ${suspicionClassNames[suspicionLevel] ?? suspicionClassNames.MEDIUM}`}>
                    {suspicionLevel}
                  </span>
                </dd>
              </div>
            </dl>

            <h3 className="mt-6 text-sm font-bold text-navy-700">위험 요소</h3>
            <div className="mt-2">
              <BulletList
                items={analysis.riskFactors}
                color="bg-danger-text"
                emptyText="특별히 감지된 위험 요소가 없어요."
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 border-t border-border-soft">
            <h2 className="text-base font-bold text-navy-950">후폭풍 타임라인</h2>
            <AftermathTimeline aftermath={excuse.aftermath} />
          </div>
        </div>

        <div className="border border-border-soft rounded-lg">
          <div className="p-6 sm:p-8">
            <h2 className="text-base font-bold text-navy-950">기억해야 할 설정</h2>
            <div className="mt-3">
              <BulletList
                items={excuse.remember}
                emptyText="아직 기억할 설정이 없어요."
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 border-t border-border-soft">
            <h2 className="text-base font-bold text-navy-950">변명 진화</h2>
            <p className="mt-2 text-sm font-normal text-navy-500">
              같은 변명을 더 그럴듯하게, 더 짧게, 더 뻔뻔하게 바꾸는 기능이에요.
            </p>
            <button
              type="button"
              onClick={() => showPendingFeature("변명 진화 기능은 다음 순서에서 API와 연결할게요.")}
              className="mt-4 w-full px-5 py-2.5 text-sm font-bold text-white bg-brand-primary rounded-md shadow-[0_4px_10px_rgba(21,126,251,0.18)] hover:bg-brand-primary-hover transition-all"
            >
              진화 준비하기
            </button>

            {excuse.complexityWarning?.enabled && (
              <p className="mt-4 text-sm font-medium text-suspicion-medium-text bg-suspicion-medium-bg rounded-md px-3.5 py-2.5">
                ⚠️ {excuse.complexityWarning.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <section aria-label="대화 스레드" className="mt-6 border border-border-soft rounded-lg p-6 sm:p-8">
        <h2 className="text-base font-bold text-navy-950">대화 스레드</h2>
        <p className="mt-1.5 text-sm font-normal text-navy-500">
          상대방이 실제로 뭐라고 답장했는지 알려주면, 그 내용에 이어지는 다음 변명을 준비할 수 있어요.
        </p>

        <ol className="mt-5 space-y-3">
          <li className="rounded-md bg-surface-soft p-4">
            <span className="px-2 py-0.5 text-[11px] font-bold text-white bg-brand-primary rounded-md whitespace-nowrap">
              {roundNumber}라운드 · 원본
            </span>
            <p className="mt-2 text-sm font-normal text-navy-900 leading-relaxed">"{excuse.excuse}"</p>
          </li>
        </ol>

        <button
          type="button"
          onClick={() => showPendingFeature("답장 준비 기능은 변명 진화 다음 단계에서 API와 연결할게요.")}
          className="mt-5 px-5 py-2.5 text-sm font-bold text-white bg-brand-primary rounded-md shadow-[0_4px_10px_rgba(21,126,251,0.18)] hover:bg-brand-primary-hover transition-all"
        >
          답장 준비하기
        </button>
      </section>
    </main>
  );
}
