import { useState } from "react";

const fallbackTargets = [
  { code: "TEACHER", label: "선생님" },
  { code: "PARENT", label: "부모님" },
  { code: "FRIEND", label: "친구" },
  { code: "LOVER", label: "연인" },
  { code: "TEAM_LEAD", label: "팀장" },
  { code: "TEAM_MEMBER", label: "팀원" },
];

const fallbackTones = [
  { code: "MILD", label: "순한맛" },
  { code: "SLICK", label: "능글맞은맛" },
  { code: "DESPERATE", label: "목숨 걸기" },
  { code: "BULLSHIT", label: "개소리 모드" },
];

function OptionDropdown({ label, placeholder, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.code === value);

  return (
    <div>
      <span className="block text-xs font-medium text-navy-500">{label}</span>
      <div className="relative mt-1.5">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 rounded-md border border-border-input bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition"
        >
          <span className={selectedOption ? "text-navy-900" : "text-[#a3b2c7]"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-navy-300 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1.5 bg-white border border-border-soft rounded-md shadow-[0_8px_24px_rgba(11,42,85,0.10)] py-1"
          >
            {options.map((option) => {
              const isSelected = option.code === value;

              return (
                <li key={option.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.code);
                      setIsOpen(false);
                    }}
                    className={
                      isSelected
                        ? "w-full text-left px-3.5 py-2.5 text-sm font-medium text-white bg-brand-primary cursor-pointer"
                        : "w-full text-left px-3.5 py-2.5 text-sm font-normal text-navy-900 hover:bg-surface-soft cursor-pointer"
                    }
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ExcuseFormPage() {
  const [situation, setSituation] = useState("");
  const [target, setTarget] = useState("");
  const [tone, setTone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 1단계 UI 구현에서는 실제 API 호출 대신 입력값 검증까지만 담당한다.
  // 다음 커밋에서 /api/meta와 /api/excuses 연동을 붙이면서 이 submit 흐름을 실제 요청으로 교체한다.
  function handleSubmit(event) {
    event.preventDefault();

    if (!situation.trim() || !target || !tone) {
      setErrorMessage("위기 상황과 상대, 강도를 모두 입력해주세요.");
      return;
    }

    setErrorMessage("다음 단계에서 실제 변명 생성 API와 연결됩니다.");
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-white">
      <h1 className="text-2xl font-bold text-navy-950">지금 무슨 위기인가요?</h1>
      <p className="mt-1.5 text-sm font-normal text-navy-500">
        위기 상황을 자세히 적어주시면, AI가 상대와 강도에 맞춰 변명을 만들고 성공 확률까지 계산해드려요.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <section aria-label="위기 상황" className="border-2 border-[#bedafd] bg-brand-primary-soft/40 rounded-lg p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-white shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="w-4.5 h-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <label htmlFor="situation" className="block text-base font-bold text-navy-950">
                위기 상황을 알려주세요
              </label>
              <p className="mt-0.5 text-sm font-normal text-navy-500">
                최대한 자세히 적을수록 AI가 더 그럴듯한 변명을 만들어요
              </p>
            </div>
          </div>

          <textarea
            id="situation"
            name="situation"
            required
            maxLength={500}
            rows={6}
            placeholder="예: 팀 프로젝트 회의에 늦잠 자서 못 갔다"
            value={situation}
            onChange={(event) => {
              setSituation(event.target.value);
              setErrorMessage("");
            }}
            className="mt-4 w-full rounded-md border border-border-input bg-white px-4 py-3.5 text-base text-navy-900 placeholder:text-[#a3b2c7] focus:outline-none focus:border-brand-primary transition resize-none"
          />
          <span className="mt-1.5 block text-right text-xs font-normal text-navy-500">
            {situation.length}/500
          </span>
        </section>

        <section aria-label="변명 상대와 강도" className="mt-5 border border-border-soft rounded-lg p-6 sm:p-7">
          <h2 className="text-sm font-bold text-navy-700">누구에게, 얼마나 뻔뻔하게?</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <OptionDropdown
              label="변명 상대"
              placeholder="선택하세요"
              value={target}
              options={fallbackTargets}
              onChange={(value) => {
                setTarget(value);
                setErrorMessage("");
              }}
            />
            <OptionDropdown
              label="변명 강도"
              placeholder="선택하세요"
              value={tone}
              options={fallbackTones}
              onChange={(value) => {
                setTone(value);
                setErrorMessage("");
              }}
            />
          </div>
        </section>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto sm:min-w-[280px] flex items-center justify-center gap-2.5 px-6 py-3 text-base font-bold text-white bg-brand-primary rounded-md shadow-[0_4px_10px_rgba(21,126,251,0.18)] hover:bg-brand-primary-hover hover:shadow-[0_5px_12px_rgba(21,126,251,0.22)] transition-all"
          >
            변명 만들기
          </button>

          {errorMessage && (
            <p role="alert" className="w-full sm:w-auto text-sm font-medium text-danger-text bg-danger-bg rounded-md px-3.5 py-2.5 text-center">
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
