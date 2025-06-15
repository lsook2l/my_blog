import React from 'react';

export default function AboutPage() {
  return (
    <div>
      <div className="max-w-4xl md:max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">Sook's 자기계발 블로그</h1>
        <p className="text-purple-500 text-base md:text-lg">심리학과 뇌과학을 통해 더 나은 미래를 만들어갑니다</p>
      </div>

      {/* 블로그 운영자 */}
      <section className="max-w-2xl mx-auto mb-10">
        <h2 className="text-lg font-bold mb-3 text-left">블로그 운영자</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-500">김</div>
          <div>
            <div className="font-semibold text-gray-800">김진숙</div>
            <div className="text-sm text-gray-500">자기계발과 성장의 여정을 기록합니다</div>
            <div className="text-xs text-purple-400 mt-1">Instagram</div>
          </div>
        </div>
      </section>

      {/* 블로그 소개 */}
      <section className="max-w-2xl mx-auto mb-10">
        <h2 className="text-lg font-bold mb-3 text-left">블로그 소개</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 text-left">
          <div className="flex items-center mb-2 font-bold text-purple-500"><span className="mr-2">🎯</span>블로그의 목적</div>
          <div className="text-sm text-gray-700">이 블로그는 자기계발과 성장에 관심 있는 모든 분들을 위한 공간입니다. 심리학과 뇌과학의 관점에서 인간의 성장과 발전을 탐구하고, 실질적인 자기계발 방법을 공유합니다. 단순한 정보 전달을 넘어, 실제로 적용 가능한 통찰과 경험을 나누는 것을 목표로 합니다.</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 text-left">
          <div className="font-bold text-purple-500 mb-2">✨ 블로그의 특징</div>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li><span className="font-semibold text-purple-500">과학적 근거 기반</span> - 검증된 연구와 데이터를 바탕으로 한 정보 제공</li>
            <li><span className="font-semibold text-purple-500">실용적 접근</span> - 일상생활에서 바로 적용할 수 있는 실천적 방법 제시</li>
            <li><span className="font-semibold text-purple-500">체계적 구성</span> - 주제별로 체계화된 콘텐츠로 쉽게 원하는 정보 탐색</li>
            <li><span className="font-semibold text-purple-500">경험 공유</span> - 독자들과의 상호작용을 통한 집단 지성 형성</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-left">
          <div className="font-bold text-purple-500 mb-2">📚 주요 콘텐츠</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div>
              <div className="font-semibold text-gray-700 mb-1">이론과 연구</div>
              <ul className="list-disc pl-4 text-gray-500 space-y-0.5">
                <li>최신 심리학 연구 동향</li>
                <li>뇌과학 기반 학습 방법</li>
                <li>행동 변화의 과학적 원리</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">독서와 성장</div>
              <ul className="list-disc pl-4 text-gray-500 space-y-0.5">
                <li>과학적 독서법</li>
                <li>주요 도서 리뷰</li>
                <li>학습 습관 높이기</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">실전과 적용</div>
              <ul className="list-disc pl-4 text-gray-500 space-y-0.5">
                <li>습관 형성 가이드</li>
                <li>생산성 향상 팁</li>
                <li>개인 개선 전략</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">성장과 발전</div>
              <ul className="list-disc pl-4 text-gray-500 space-y-0.5">
                <li>자기 이해의 성장</li>
                <li>목표 설정과 달성</li>
                <li>마인드셋 개선</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 독자분들께 */}
      <section className="max-w-2xl mx-auto mb-10">
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-left">
          <div className="flex items-center mb-2 font-bold text-pink-500"><span className="mr-2">💝</span>독자분들께</div>
          <div className="text-sm text-gray-700">이 블로그는 여러분의 참여로 더욱 풍성해집니다. 댓글과 피드백을 통해 여러분의 경험과 통찰을 공유해주세요. 함께 배우고 성장하는 커뮤니티를 만드는 것이 이 블로그의 긍정적인 목표입니다.</div>
        </div>
      </section>

      {/* 주요 주제 */}
      <section className="max-w-4xl mx-auto mb-10">
        <h2 className="text-lg font-bold mb-3 text-left">주요 주제</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '심리학/뇌과학', desc: '과학적 근거 기반/뇌의 자기계발', color: 'from-purple-200 to-purple-100' },
            { label: '인간관계', desc: '효과적인 소통과 관계 형성', color: 'from-blue-100 to-purple-50' },
            { label: '독서', desc: '책을 통한 성장과 통찰', color: 'from-pink-100 to-purple-50' },
            { label: '습관 형성', desc: '긍정적 습관 만들기', color: 'from-yellow-100 to-pink-50' },
            { label: '생산성', desc: '시간 관리와 목표 달성', color: 'from-green-100 to-blue-50' },
            { label: '마인드셋', desc: '성장 지향적 사고방식', color: 'from-pink-100 to-yellow-50' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl bg-gradient-to-br ${item.color} p-4 flex flex-col items-center justify-center`}>
              <div className="font-bold text-gray-700 mb-1">{item.label}</div>
              <div className="text-xs text-gray-500 text-center">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 연락처 */}
      <section className="max-w-2xl mx-auto mb-10">
        <h2 className="text-lg font-bold mb-3 text-left">연락처</h2>
        <div className="grid grid-cols-2 gap-4">
          <a href="mailto:example@email.com" className="rounded-lg border border-gray-200 bg-white py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-purple-50 transition"><span>📧</span>E-mail</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 bg-white py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-pink-50 transition"><span>📸</span>Instagram</a>
        </div>
      </section>
    </div>
  );
} 