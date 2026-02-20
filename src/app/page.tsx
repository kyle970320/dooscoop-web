"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

const Lanyard = dynamic(() => import("./components/Lanyard"), {
  ssr: false,
  loading: () => <div className="w-full h-screen" />,
});

type Talent = {
  emoji: string;
  skill: string;
  person: string;
  color: string;
};

const TALENTS: Talent[] = [
  { emoji: "🎨", skill: "그래픽 디자인", person: "김민지", color: "#FF5B2E" },
  { emoji: "🎸", skill: "기타 레슨", person: "박준호", color: "#3DDC84" },
  { emoji: "💻", skill: "웹 개발", person: "이서연", color: "#4A90E2" },
  { emoji: "📸", skill: "사진 촬영", person: "최다은", color: "#FFD447" },
  { emoji: "🍳", skill: "요리 클래스", person: "정우진", color: "#FF5B2E" },
  { emoji: "✍️", skill: "카피라이팅", person: "한소희", color: "#C084FC" },
  { emoji: "🎬", skill: "영상 편집", person: "오태양", color: "#3DDC84" },
  { emoji: "🗣️", skill: "영어 회화", person: "임채원", color: "#4A90E2" },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "재능 등록",
    desc: "내가 가진 재능을 등록하세요. 그림, 코딩, 음악, 요리 — 뭐든 괜찮아요.",
    color: "#FF5B2E",
  },
  {
    num: "02",
    title: "원하는 재능 찾기",
    desc: "배우고 싶은 스킬을 가진 사람을 찾아보세요. 필터로 딱 맞는 파트너를.",
    color: "#3DDC84",
  },
  {
    num: "03",
    title: "교환 제안",
    desc: "서로의 재능을 맞바꾸자고 제안하세요. 돈은 필요 없어요.",
    color: "#FFD447",
  },
  {
    num: "04",
    title: "같이 성장",
    desc: "교환하고, 배우고, 새로운 사람과 연결되세요. 커뮤니티가 함께 자랍니다.",
    color: "#4A90E2",
  },
];

const TESTIMONIALS = [
  {
    text: "디자인 스킬을 개발 멘토링과 교환했어요. 돈 한 푼 안 들고 제가 원하던 걸 배웠습니다.",
    name: "김태희",
    role: "UX 디자이너",
    emoji: "🎨",
  },
  {
    text: "요리 레시피 알려주고 영어 회화 배웠어요. 이게 진짜 윈윈이죠!",
    name: "박성진",
    role: "셰프",
    emoji: "🍳",
  },
  {
    text: "기타 레슨을 사진 촬영 강의와 바꿨는데, 둘 다 너무 만족스러워요.",
    name: "이유나",
    role: "뮤지션",
    emoji: "🎸",
  },
];

function FloatingCard({
  talent,
  style,
  delay,
}: {
  talent: Talent;
  style: React.CSSProperties & { "--rot"?: string };
  delay: number;
}) {
  return (
    <div
      className="absolute bg-white rounded-2xl p-5 shadow-xl w-44"
      style={{
        ...style,
        animation: `floatCard 4s ease-in-out infinite ${delay}s`,
        borderTop: `4px solid ${talent.color}`,
      }}
    >
      <div className="text-3xl mb-2">{talent.emoji}</div>
      <div className="font-black text-base text-gray-900 leading-tight mb-1">
        {talent.skill}
      </div>
      <div className="text-xs text-gray-400">{talent.person}</div>
    </div>
  );
}

function TalentPill({ talent }: { talent: Talent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 select-none ${
        hovered ? "" : "text-foreground"
      }`}
      style={{
        background: hovered ? talent.color : "#F0EDE6",
        color: hovered ? "white" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-lg">{talent.emoji}</span>
      <span className="font-semibold text-sm">{talent.skill}</span>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const [isReady, setIsReady] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 페이지와 캔버스가 로드될 때까지 기다린 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800); // Lanyard 캔버스가 로드될 시간을 고려한 지연

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const section = target.dataset.section;
            if (section) {
              setVisibleSections((prev) => new Set([...prev, section]));
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  const addRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  const isVisible = (key: string) => visibleSections.has(key);

  return (
    <div className="min-h-screen overflow-x-hidden text-foreground">
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5 font-body transition-all duration-300"
        style={{
          background: scrollY > 60 ? "rgba(252,252,252,0.95)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(12px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(26,26,24,0.08)" : "none",
        }}
      >
        <div
          className="font-display text-2xl tracking-tight"
          style={{ letterSpacing: "-1px" }}
        >
          두<span className="text-main">스쿱</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium">
          <a
            href="#how"
            className="text-foreground hover:text-main transition-colors"
          >
            어떻게 쓰나요
          </a>
          <a
            href="#talents"
            className="text-foreground hover:text-main transition-colors"
          >
            재능 둘러보기
          </a>
          <a
            href="#about"
            className="text-foreground hover:text-main transition-colors"
          >
            소개
          </a>
        </div>
        <a
          href="#cta"
          className="btn-main font-body font-bold text-sm px-6 py-3 rounded-full"
        >
          무료로 시작하기
        </a>
      </nav>
      <motion.div
        className="absolute top-1/5 sm:top-1/2 left-1/2 w-full max-w-4/5 lg:max-w-[900px] flex flex-col sm:flex-row items-center sm:items-start sm:justify-between transform -translate-x-1/2 -translate-y-1/2 z-2 text-main text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold select-none"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="flex flex-row sm:flex-col gap-1 sm:gap-4 text-center sm:text-left"
          initial={{ y: 30, opacity: 0 }}
          animate={isReady ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isReady ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            당신의{` `}
          </motion.span>
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isReady ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            재능이
          </motion.span>
        </motion.p>
        <motion.p
          className="flex flex-row sm:flex-col gap-1 sm:gap-4 text-center sm:text-left"
          initial={{ y: 30, opacity: 0 }}
          animate={isReady ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isReady ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            빛날 수{` `}
          </motion.span>
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isReady ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            있도록
          </motion.span>
        </motion.p>
      </motion.div>
      <Lanyard />
      {/* HERO */}
      <section className="min-h-screen grid md:grid-cols-2 relative overflow-hidden">
        {/* Left */}
        <div className="flex flex-col justify-center px-8 md:px-16 pt-32 pb-20 relative z-10">
          <div className="font-mono text-xs font-bold tracking-widest uppercase mb-6 animate-fadeUp text-main">
            재능 물물교환 플랫폼
          </div>
          <h1
            className="font-display leading-none mb-6 animate-fadeUp-delay-1"
            style={{
              fontSize: "clamp(52px, 7vw, 92px)",
              letterSpacing: "-3px",
            }}
          >
            재능으로
            <br />
            <span className="text-main">교환하자</span>
          </h1>
          <p
            className="font-body text-lg leading-relaxed mb-10 animate-fadeUp-delay-2"
            style={{ color: "#8A8780", maxWidth: "400px", fontWeight: 300 }}
          >
            돈 없이도 배울 수 있어요. 내 재능을 나누고, 원하는 스킬을 얻으세요.
            두스쿱은 재능으로 연결되는 커뮤니티입니다.
          </p>
          <div className="flex flex-wrap gap-4 items-center animate-fadeUp-delay-3">
            <a
              href="#cta"
              className="btn-main font-body font-bold text-base px-8 py-4 rounded-full inline-block"
            >
              내 재능 등록하기 →
            </a>
            <a
              href="#how"
              className="font-body font-medium text-sm flex items-center gap-2 text-foreground"
            >
              <span className="text-main">▶</span> 어떻게 작동하나요?
            </a>
          </div>
          <div className="flex items-center gap-6 mt-12 animate-fadeUp-delay-4">
            <div>
              <div
                className="font-display text-3xl"
                style={{ letterSpacing: "-2px" }}
              >
                2,400+
              </div>
              <div
                className="font-body text-xs mt-1"
                style={{ color: "#8A8780" }}
              >
                등록된 재능
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: "#D4CFC6" }} />
            <div>
              <div
                className="font-display text-3xl"
                style={{ letterSpacing: "-2px" }}
              >
                890+
              </div>
              <div
                className="font-body text-xs mt-1"
                style={{ color: "#8A8780" }}
              >
                성공한 교환
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: "#D4CFC6" }} />
            <div>
              <div
                className="font-display text-3xl"
                style={{ letterSpacing: "-2px" }}
              >
                150+
              </div>
              <div
                className="font-body text-xs mt-1"
                style={{ color: "#8A8780" }}
              >
                도시
              </div>
            </div>
          </div>
        </div>

        {/* Right - floating cards visual */}
        <div className="relative flex items-center justify-center min-h-64 md:min-h-full">
          {/* bg blob */}
          <div
            className="absolute rounded-full opacity-20 bg-main"
            style={{
              width: 420,
              height: 420,
              filter: "blur(80px)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          <div className="relative" style={{ width: 320, height: 360 }}>
            <FloatingCard
              talent={TALENTS[0]}
              style={{ top: 0, left: 0, "--rot": "-4deg" }}
              delay={0}
            />
            <FloatingCard
              talent={TALENTS[2]}
              style={{ bottom: 0, right: 0, "--rot": "3deg" }}
              delay={1.2}
            />
            <FloatingCard
              talent={TALENTS[5]}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                "--rot": "1deg",
              }}
              delay={0.6}
            />
            {/* swap arrow */}
            <div
              className="absolute z-10 flex items-center justify-center text-xl font-bold"
              style={{
                width: 48,
                height: 48,
                background: "#FFD447",
                borderRadius: "50%",
                top: "30%",
                right: "10%",
                boxShadow: "0 8px 24px rgba(255,212,71,0.5)",
                animation: "spin-slow 8s linear infinite",
              }}
            >
              ⇄
            </div>
          </div>
        </div>

        {/* decorative bottom diagonal */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom right, transparent 49%, var(--background) 50%)",
          }}
        />
      </section>

      {/* MARQUEE */}
      <div className="py-5 overflow-hidden border-y border-foreground bg-foreground">
        <div className="marquee-track">
          {[...TALENTS, ...TALENTS].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-8 text-white font-body font-medium text-sm whitespace-nowrap"
            >
              <span className="text-xl">{t.emoji}</span>
              <span>{t.skill}</span>
              <span className="text-main">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-8 md:px-16">
        <div
          ref={addRef("how")}
          data-section="how"
          className={`section-hidden ${isVisible("how") ? "section-visible" : ""}`}
        >
          <div className="text-center mb-16">
            <div className="scoop-badge mb-4">어떻게 쓰나요</div>
            <h2
              className="font-display text-5xl md:text-6xl mb-4"
              style={{ letterSpacing: "-2px" }}
            >
              4단계면 충분해요
            </h2>
            <p
              className="font-body text-lg"
              style={{ color: "#8A8780", fontWeight: 300 }}
            >
              복잡한 결제 없이, 재능만으로 연결되는 경험
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 card-hover"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  borderBottom: `4px solid ${step.color}`,
                }}
              >
                <div
                  className="font-mono text-xs font-bold mb-6 inline-block px-3 py-1 rounded-full"
                  style={{ background: step.color + "20", color: step.color }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-display text-2xl mb-3"
                  style={{ letterSpacing: "-1px" }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "#8A8780", fontWeight: 300 }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TALENTS GRID */}
      <section id="talents" className="py-20 px-8 md:px-16 bg-foreground">
        <div
          ref={addRef("talents")}
          data-section="talents"
          className={`section-hidden ${isVisible("talents") ? "section-visible" : ""}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="scoop-badge mb-4">재능 둘러보기</div>
              <h2
                className="font-display text-5xl md:text-6xl text-background"
                style={{ letterSpacing: "-2px" }}
              >
                어떤 재능이
                <br />
                있을까요?
              </h2>
            </div>
            <p
              className="font-body text-base md:max-w-xs"
              style={{ color: "#8A8780", fontWeight: 300 }}
            >
              디자인부터 요리까지. 여러분의 숨겨진 재능을 공유하세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {TALENTS.map((t, i) => (
              <TalentPill key={i} talent={t} />
            ))}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer font-body font-semibold text-sm"
              style={{ border: "1px dashed #8A8780", color: "#8A8780" }}
            >
              + 더 보기
            </div>
          </div>

          {/* Featured exchange cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {[
              { from: TALENTS[0], to: TALENTS[2] },
              { from: TALENTS[1], to: TALENTS[3] },
              { from: TALENTS[5], to: TALENTS[6] },
            ].map((pair, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 card-hover"
                style={{ background: "#252522" }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{pair.from.emoji}</span>
                    <span className="font-display text-sm text-background">
                      {pair.from.skill}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#8A8780" }}
                    >
                      {pair.from.person}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-[#FFD447] text-foreground">
                      ⇄ 교환
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{pair.to.emoji}</span>
                    <span className="font-display text-sm text-background">
                      {pair.to.skill}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#8A8780" }}
                    >
                      {pair.to.person}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-8 md:px-16">
        <div
          ref={addRef("testimonials")}
          data-section="testimonials"
          className={`section-hidden ${isVisible("testimonials") ? "section-visible" : ""}`}
        >
          <div className="text-center mb-16">
            <div className="scoop-badge mb-4">후기</div>
            <h2
              className="font-display text-5xl md:text-6xl"
              style={{ letterSpacing: "-2px" }}
            >
              실제로 해봤어요
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 card-hover"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-6">{t.emoji}</div>
                <p
                  className="font-body text-base leading-relaxed mb-6"
                  style={{ color: "#3A3A38", fontWeight: 400 }}
                >
                  "{t.text}"
                </p>
                <div>
                  <div
                    className="font-display text-lg"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="font-body text-sm mt-1"
                    style={{ color: "#8A8780" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-28 px-8 md:px-16">
        <div
          ref={addRef("cta")}
          data-section="cta"
          className={`section-hidden ${isVisible("cta") ? "section-visible" : ""}`}
        >
          <div className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden bg-main">
            {/* decorative circles */}
            <div
              className="absolute opacity-10"
              style={{
                width: 400,
                height: 400,
                borderRadius: "50%",
                border: "60px solid white",
                top: -120,
                right: -120,
              }}
            />
            <div
              className="absolute opacity-10"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "30px solid white",
                bottom: -60,
                left: 40,
              }}
            />

            <div className="relative z-10">
              <h2
                className="font-display text-5xl md:text-7xl mb-6 text-white"
                style={{ letterSpacing: "-3px" }}
              >
                지금 바로
                <br />
                시작하세요
              </h2>
              <p
                className="font-body text-xl mb-10 text-white opacity-80 max-w-md mx-auto"
                style={{ fontWeight: 300 }}
              >
                가입은 무료. 재능만 있으면 충분해요. 지금 등록하고 첫 번째 교환
                파트너를 찾아보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="font-body font-bold text-base px-10 py-4 rounded-full inline-block transition-all duration-200 bg-foreground text-background hover:bg-[#FFD447] hover:text-foreground"
                >
                  무료로 시작하기 →
                </a>
                <a
                  href="#"
                  className="font-body font-bold text-base px-10 py-4 rounded-full inline-block transition-all duration-200"
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.background = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.background = "transparent";
                  }}
                >
                  재능 둘러보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-8 md:px-16 py-10 border-t"
        style={{ borderColor: "#D4CFC6" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className="font-display text-2xl"
            style={{ letterSpacing: "-1px" }}
          >
            두<span className="text-main">스쿱</span>
          </div>
          <div className="font-body text-sm" style={{ color: "#8A8780" }}>
            © 2025 두스쿱. 재능으로 연결되는 세상.
          </div>
          <div
            className="flex gap-6 font-body text-sm"
            style={{ color: "#8A8780" }}
          >
            <a href="#" className="hover:text-main transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-main transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-main transition-colors">
              문의하기
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
