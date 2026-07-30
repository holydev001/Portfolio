"use client";

import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Github, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AmbientField } from "./ambient-field";

const zenitsuAvatar = "/pfp.png";
const querycraftPreview = "/querycraft-preview.png";
const objekt404Preview = "/objekt-404.png";

const NAV = [
  { label: "Index", id: "top" },
  { label: "Work", id: "work" },
  { label: "Projects", id: "projects" },
  { label: "Stack", id: "stack" },
  { label: "Contact", id: "contact" },
];

const SKILLS = {
  Languages: ["JavaScript", "TypeScript", "Python"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "HTML"],
  Backend: ["Node.js", "Express.js", "Django", "FastAPI"],
  Databases: ["MySQL", "MongoDB", "Supabase"],
  Mobile: ["React Native"],
  Practice: ["Project Management", "Agile / Sprints", "Code Review"],
};

const PROJECTS = [
  {
    no: "01",
    name: "Visual Query Builder",
    tag: "Developer Tool",
    description:
      "An interactive, drag-and-drop SQL query builder that lets you compose complex queries visually — no syntax memorization required. Built to make data exploration accessible for non-SQL users while still generating production-ready queries under the hood.",
    stack: ["Next.js", "TypeScript", "Tailwind", "React"],
    live: "https://visual-query-builder-ten.vercel.app/",
    repo: "https://github.com/holydev001/visual-query-builder",
    year: "2025",
    image: querycraftPreview,
    imageAlt: "QueryCraft visual query builder — landing page preview",
  },
  {
    no: "02",
    name: "OBJEKT//404",
    tag: "Interactive Experience",
    description:
      "An experimental interactive artifact — a cinematic 3D object recovered from a future not yet rendered. Drag, scroll, and hover to manipulate the broadcast. Built as a love letter to brutalist web design and real-time 3D on the web.",
    stack: ["React", "Three.js", "TypeScript", "GSAP"],
    live: "https://objekt-404.vercel.app/",
    repo: "https://github.com/holydev001/objekt-404",
    year: "2025",
    image: objekt404Preview,
    imageAlt: "OBJEKT//404 — cinematic 3D artifact landing page preview",
  },
];

const WORK = [
  {
    no: "01",
    role: "Lead Frontend Developer",
    company: "Emerj LLC",
    location: "Remote",
    period: "2025 — Present",
    bullets: [
      "Built an admin analytics dashboard tracking user activity, usage trends, and platform performance.",
      "Shipped scalable frontend features in Next.js using modern React patterns.",
      "Integrated backend APIs for real-time and historical data visualization.",
      "Drove code reviews, sprint planning, and iterative product improvements.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "REST"],
  },
  {
    no: "02",
    role: "Fullstack Engineer",
    company: "Nexus Haven",
    location: "Remote",
    period: "2026",
    bullets: [
      "Shipped an immersive, scroll-driven 3D landing experience for a VR meetings platform.",
      "Performance pass on the 3D scene: memoized particle buffers, capped DPR, high-performance GL context, and suspense-gated GLB preloading.",
      "Engineered an async FastAPI backend for the Nexus waitlist, maximizing registration throughput while keeping API latency low.",
      "Designed a MongoDB schema with indexing and connection pooling for fast, stable reads during peak traffic.",
    ],
    stack: ["TanStack Start", "Three.js", "FastAPI", "MongoDB", "GSAP", "Tailwind"],
  },
  {
    no: "03",
    role: "Web Developer",
    company: "Content Q",
    location: "Remote",
    period: "2025",
    bullets: [
      "Led frontend of a production marketing site in Next.js.",
      "Coordinated frontend execution, timelines, and delivery.",
      "Built high-performance landing pages tuned for SEO and responsiveness.",
      "Implemented a waitlist system with reliable backend sync.",
    ],
    stack: ["Next.js", "React", "Tailwind", "SEO"],
  },
  {
    no: "04",
    role: "Intern / Junior Developer",
    company: "HNG",
    location: "Remote",
    period: "2025",
    bullets: [
      "Contributed to real-world projects in an agile cross-functional team.",
      "Implemented features, fixed bugs, and shipped through Git pull-request workflows.",
    ],
    stack: ["Git", "Agile", "React"],
  },
];

export default function Portfolio() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const saved = localStorage.getItem("theme");
      const dark = saved ? saved === "dark" : mq.matches;
      document.documentElement.classList.toggle("dark", dark);
    };

    apply();
    mq.addEventListener("change", apply);

    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (introDone) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [introDone]);

  return (
    <div className="grain relative min-h-screen overflow-clip bg-background text-foreground md:cursor-none">
      <Cursor />
      <Intro onDone={() => setIntroDone(true)} />
      <AmbientField />
      <div className="relative z-10">
        <TopBar />
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Projects />
        <Stack />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

/* ───────────────────────────── CURSOR ───────────────────────────── */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "link" | "view" | "text">("default");
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }

      setHidden(false);
    };

    let raf = 0;

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest<HTMLElement>("[data-cursor]");

      if (cursorEl) {
        const kind = (cursorEl.dataset.cursor || "default") as typeof variant;
        setVariant(kind);
        setLabel(cursorEl.dataset.cursorLabel ?? (kind === "view" ? "View" : ""));
        return;
      }

      if (target.closest("a, button, [role='button']")) {
        setVariant("link");
        setLabel("");
        return;
      }

      if (target.closest("input, textarea, [contenteditable='true']")) {
        setVariant("text");
        setLabel("");
        return;
      }

      setVariant("default");
      setLabel("");
    };

    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[200] hidden md:block transition-opacity duration-300 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border transition-[width,height,background-color,border-color,transform] duration-300 ease-out ${
          variant === "view"
            ? "h-20 w-20 border-transparent bg-signal"
            : variant === "link"
              ? "h-12 w-12 border-foreground bg-foreground/10 mix-blend-difference"
              : variant === "text"
                ? "h-7 w-[3px] rounded-[1px] border-transparent bg-foreground mix-blend-difference"
                : "h-9 w-9 border-foreground/70 mix-blend-difference"
        }`}
      />

      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-signal transition-opacity duration-200 ${
          variant === "default" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={labelRef}
        className={`fixed left-0 top-0 select-none font-mono text-[10px] uppercase tracking-[0.18em] text-signal-foreground transition-opacity duration-200 ${
          variant === "view" && label ? "opacity-100" : "opacity-0"
        }`}
      >
        {label || "View"}
      </div>
    </div>
  );
}

/* ───────────────────────────── INTRO ───────────────────────────── */
function Intro({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const word = "holy.dev";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 900);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="fixed inset-0 z-[200] overflow-hidden bg-background text-foreground"
      aria-hidden={!show}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute left-6 right-6 top-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span>◉ Booting · 2026</span>
        <Counter />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
            style={{ transformOrigin: "right" }}
            className="absolute inset-0 z-10 bg-signal"
          />

          <h1
            className="flex items-baseline font-display text-[22vw] italic leading-[0.85] tracking-tight sm:text-[16vw] md:text-[13vw]"
            aria-label={word}
          >
            {word.split("").map((char, index) => (
              <span key={`${char}-${index}`} className="inline-block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.05,
                    duration: 0.8,
                    ease: [0.7, 0, 0.2, 1],
                  }}
                  className={`inline-block ${char === "." ? "text-signal" : ""}`}
                >
                  {char}
                </motion.span>
              </span>
            ))}

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="cursor ml-2 inline-block h-[0.7em] w-[0.08em] self-center bg-foreground"
            />
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
          style={{ transformOrigin: "left" }}
          className="mb-3 h-px w-full bg-foreground/30"
        />

        <div className="flex items-end justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>David Adams · Full-Stack Developer</span>
          <span className="hidden sm:inline">Worldwide</span>
          <span>v.26</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: show ? "-110%" : "110%" }}
        transition={{
          delay: show ? 0 : 0.05,
          duration: 0.8,
          ease: [0.7, 0, 0.2, 1],
        }}
        className="absolute inset-0 z-20 bg-foreground"
      />
    </motion.div>
  );
}

function Counter() {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / 1800);
      setN(Math.floor(progress * 100));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return <span>{String(n).padStart(3, "0")} %</span>;
}

/* ───────────────────────────── THEME TOGGLE ───────────────────────────── */
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group relative inline-flex h-7 w-14 items-center border border-border bg-background transition-colors"
    >
      <span
        className="absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center bg-foreground text-background transition-all duration-300"
        style={{ left: dark ? "calc(100% - 1.375rem)" : "0.125rem" }}
      >
        <span className="font-mono text-[9px] leading-none">{dark ? "D" : "L"}</span>
      </span>
    </button>
  );
}

/* ───────────────────────────── TOP BAR ───────────────────────────── */
function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const currentTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Lagos",
      });

      setTime(currentTime);
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] md:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-signal" />
          <span className="hidden sm:inline">Available</span>
        </div>

        <nav className="hidden gap-8 md:flex">
          {NAV.map((navItem) => (
            <a key={navItem.id} href={`#${navItem.id}`} className="link-ink">
              {navItem.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline">{time} WAT</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-6 px-5 pb-12 pt-10 md:px-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.7, 0, 0.2, 1] }}
          className="col-span-12 flex flex-col gap-6 md:col-span-3"
        >
          <Tag>№ 001 / Portfolio</Tag>

          <a
            href="/holydev.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            data-cursor-label="View CV"
            className="flex items-center gap-3 border border-border bg-paper p-3 transition-colors hover:border-signal/50"
          >
            <div className="relative size-12 shrink-0 overflow-hidden border border-border bg-background">
              <img
                src={zenitsuAvatar}
                alt="Portrait-style avatar for David Adams, also known as Priest and holydev"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                @holy.dev
              </div>
              <div className="truncate font-display text-base leading-tight">David Adams</div>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-signal" />
                available
              </div>
            </div>
          </a>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Priest / holydev001
            <br />
            Full-Stack Developer
            <br />
            Based in Nigeria
            <br />
            3+ Years in Production
          </p>

          <div className="hidden h-px w-full bg-border md:block" />

          <p className="hidden max-w-[28ch] text-sm leading-relaxed text-muted-foreground md:block">
            Currently shaping admin analytics & data visualization tools at{" "}
            <em className="font-display not-italic">Emerj LLC</em>.
          </p>
        </motion.div>

        <div className="col-span-12 md:col-span-9">
          <motion.h1
            style={{ y }}
            className="font-display text-[19vw] leading-[0.82] tracking-[-0.04em] md:text-[13vw]"
          >
            <RevealLine delay={0.1}>David</RevealLine>
            <RevealLine delay={0.25}>
              <span className="italic">Adams</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.95, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-block origin-bottom-left text-signal"
              >
                .
              </motion.span>
            </RevealLine>
          </motion.h1>
        </div>

        <div className="col-span-12 mt-12 grid grid-cols-12 gap-6 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.7, 0, 0.2, 1] }}
            className="col-span-12 md:col-span-5 md:col-start-2"
          >
            <Monogram />
          </motion.div>

          <div className="col-span-12 md:col-span-6 md:flex md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.7, 0, 0.2, 1] }}
              className="font-display text-3xl leading-[1.15] md:text-5xl"
            >
              I build <span className="italic">modern, scalable</span> web applications — end to end
              — with a focus on{" "}
              <span className="bg-signal px-2 text-signal-foreground">clean architecture</span>,
              performance, and the people who use them.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── REVEAL LINE ───────────────────────────── */
function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.95, ease: [0.7, 0, 0.2, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ───────────────────────────── MONOGRAM ───────────────────────────── */
function Monogram() {
  const ringTop = "HOLY.DEV · FULL-STACK · ENGINEER · ABUJA · 2026 · ";
  const ringBot = "FRONTEND · BACKEND · DATABASE · DEVOPS · DESIGN · ";
  return (
    <div className="@container relative aspect-[4/5] w-full overflow-hidden border border-border bg-paper">
      {/* dotted grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          color: "var(--foreground)",
        }}
      />
      {/* crosshair */}
      <div className="pointer-events-none absolute inset-6 border border-rule" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-rule" />
      <div className="pointer-events-none absolute top-1/2 left-0 w-full h-px bg-rule" />

      {/* orbit rings (SVG text on circle) */}
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="ring-top" d="M 200,250 m -160,0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0" />
          <path id="ring-bot" d="M 200,250 m -120,0 a 120,120 0 1,0 240,0 a 120,120 0 1,0 -240,0" />
        </defs>
        <g style={{ transformOrigin: "200px 250px" }} className="orbit-slow">
          <text className="fill-current font-mono uppercase" fontSize="11" letterSpacing="6">
            <textPath href="#ring-top">{ringTop.repeat(2)}</textPath>
          </text>
        </g>
        <g style={{ transformOrigin: "200px 250px" }} className="orbit-rev">
          <text
            className="fill-current font-mono uppercase opacity-60"
            fontSize="9"
            letterSpacing="4"
          >
            <textPath href="#ring-bot">{ringBot.repeat(2)}</textPath>
          </text>
        </g>
      </svg>

      {/* center: holy.dev wordmark + full-stack stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] px-[4cqw]">
        <div className="float-y relative text-center">
          <div className="font-display font-semibold text-[22cqw] leading-[0.85] tracking-tight">
            <span>holy</span>
            <span className="text-signal">.</span>
            <span className="italic">dev</span>
          </div>
          <div className="mt-[1.5cqw] flex items-center justify-center gap-[1.5cqw] font-mono text-[2.4cqw] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="h-px w-[5cqw] bg-foreground/40" />
            full · stack
            <span className="h-px w-[5cqw] bg-foreground/40" />
          </div>
        </div>

        {/* stack pyramid */}
        <div className="mt-[1cqw] flex flex-col items-center gap-[0.5cqw] font-mono text-[2.2cqw] uppercase tracking-[0.25em] text-muted-foreground">
          <span>UI · UX</span>
          <span>REACT · NEXT</span>
          <span>NODE · API · EDGE</span>
          <span className="text-signal">POSTGRES · STORAGE</span>
        </div>
      </div>

      {/* corner marks */}
      <CornerMark className="left-2 top-2" />
      <CornerMark className="right-2 top-2 rotate-90" />
      <CornerMark className="left-2 bottom-2 -rotate-90" />
      <CornerMark className="right-2 bottom-2 rotate-180" />

      {/* caption strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-background/90 px-3 py-2 font-mono text-[10px] uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-signal" />
          HOLY.DEV / Full-Stack
        </span>
        <span>EST · MMXXIII</span>
      </div>
    </div>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute size-4 ${className}`}>
      <div className="absolute left-0 top-0 h-px w-full bg-foreground" />
      <div className="absolute left-0 top-0 h-full w-px bg-foreground" />
    </div>
  );
}

/* ───────────────────────────── MARQUEE ───────────────────────────── */
function Marquee() {
  const row1 = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind",
    "Supabase",
    "FastAPI",
    "Django",
    "React Native",
    "MongoDB",
    "MySQL",
    "Express",
  ];
  const row2 = [
    "Clean Architecture",
    "Edge Functions",
    "REST",
    "Server Components",
    "Sprints",
    "Code Review",
    "Design Systems",
    "Performance",
  ];
  return (
    <section className="marquee-wrap relative overflow-hidden border-y border-border bg-background text-foreground">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="border-b border-foreground/10 py-5">
        <div className="marquee-track flex w-max shrink-0 gap-10 whitespace-nowrap font-display text-3xl md:text-7xl">
          {[...row1, ...row1].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                {String((i % row1.length) + 1).padStart(2, "0")}
              </span>
              <span className={i % 4 === 1 ? "italic text-signal" : ""}>{t}</span>
              <span aria-hidden className="text-foreground/30">
                ✶
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="py-3">
        <div className="marquee-track-rev flex w-max shrink-0 gap-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.35em] text-foreground/55 md:text-base">
          {[...row2, ...row2].map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>{t}</span>
              <span className="text-foreground/30">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── ABOUT ───────────────────────────── */
function About() {
  return (
    <Section
      id="about"
      label="002 / Summary"
      title={
        <>
          The <span className="italic">short</span> version.
        </>
      }
    >
      <div className="col-span-12 md:col-span-7 md:col-start-4">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          className="font-display text-2xl leading-snug md:text-4xl"
        >
          Full-Stack Developer with 3+ years building web applications from end to end. Fluent in
          JavaScript, TypeScript, React, Next.js and Node.js — with a strong taste for clean
          architecture, predictable APIs, and interfaces that respect the user's time.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="mt-12 grid grid-cols-2 gap-6 border-t border-rule pt-6 font-mono text-xs uppercase tracking-widest md:grid-cols-4"
        >
          <Stat k="3+" v="Years building" />
          <Stat k="4" v="Production teams" />
          <Stat k="∞" v="PR reviews" />
          <Stat k="01" v="Time zone (WAT)" />
        </motion.div>
      </div>
    </Section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } },
      }}
    >
      <div className="font-display text-4xl tracking-tight text-foreground">{k}</div>
      <div className="mt-1 text-muted-foreground">{v}</div>
    </motion.div>
  );
}

/* ───────────────────────────── WORK ───────────────────────────── */
function Work() {
  return (
    <Section
      id="work"
      label="003 / Selected Work"
      title={
        <>
          Where I've <span className="italic">shipped</span>.
        </>
      }
    >
      <div className="col-span-12 mt-4 flex flex-col">
        {WORK.map((w, i) => (
          <WorkRow key={i} item={w} />
        ))}
      </div>
    </Section>
  );
}

function WorkRow({ item }: { item: (typeof WORK)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
      className="group border-t border-border last:border-b"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="view"
        data-cursor-label={open ? "Close" : "Open"}
        className="grid w-full grid-cols-12 items-center gap-4 py-8 text-left transition-colors hover:bg-paper md:py-10"
      >
        <span className="col-span-2 font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-1">
          {item.no}
        </span>
        <span className="col-span-10 font-display text-3xl tracking-tight md:col-span-5 md:text-5xl">
          {item.company}
        </span>
        <span className="col-span-6 font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-3">
          {item.role}
        </span>
        <span className="col-span-5 text-right font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-2">
          {item.period}
        </span>
        <span className="col-span-12 hidden text-right font-mono text-xs md:col-span-1 md:inline">
          {open ? "[ — ]" : "[ + ]"}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-12 gap-4 pb-10 md:gap-6">
          <div className="col-span-12 md:col-span-6 md:col-start-2">
            <ul className="space-y-3">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-base leading-relaxed md:text-lg">
                  <span className="mt-2 inline-block size-1.5 shrink-0 bg-signal" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-9">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Stack
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.location}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────── STACK ───────────────────────────── */
/* ───────────────────────────── PROJECTS ───────────────────────────── */
function Projects() {
  return (
    <Section
      id="projects"
      label="004 / Personal Projects"
      title={
        <>
          Things I've <span className="italic">built</span>.
        </>
      }
    >
      <div className="col-span-12 grid grid-cols-1 gap-px bg-border md:grid-cols-2">
        {PROJECTS.map((p) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            className="group relative flex flex-col gap-6 bg-background p-6 transition-colors hover:bg-paper md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{p.no}</span>
                <span className="inline-block h-px w-6 bg-border" />
                <span>{p.tag}</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.year}
              </span>
            </div>

            {p.image && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                data-cursor-label="Visit"
                className="relative block overflow-hidden border border-border bg-paper"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.imageAlt ?? p.name}
                    loading="lazy"
                    decoding="async"
                    width={1600}
                    height={1000}
                    className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </a>
            )}

            <h3 className="font-display text-4xl leading-[0.95] tracking-tight transition-colors group-hover:text-signal md:text-6xl">
              {p.name}
            </h3>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {p.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-5 pt-2">
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                data-cursor-label="Visit"
                className="link-ink font-mono text-xs uppercase tracking-widest"
              >
                → Live site
              </a>
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                <span>Source</span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────────── STACK ───────────────────────────── */
function Stack() {
  return (
    <Section
      id="stack"
      label="005 / Toolkit"
      title={
        <>
          The <span className="italic">stack</span>.
        </>
      }
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="col-span-12 grid grid-cols-1 gap-px bg-border md:grid-cols-3"
      >
        {Object.entries(SKILLS).map(([group, items]) => (
          <motion.div
            key={group}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } },
            }}
            whileHover={{ y: -4 }}
            className="bg-background p-6 transition-colors hover:bg-paper md:p-8"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {group}
            </div>
            <ul className="mt-4 space-y-1.5">
              {items.map((it) => (
                <li
                  key={it}
                  className="font-display text-2xl leading-tight tracking-tight transition-colors hover:text-signal md:text-3xl"
                >
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ───────────────────────────── CONTACT ───────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-background text-foreground">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-6 px-5 py-16 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          className="col-span-12 md:col-span-3"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            006 / Contact
          </div>
        </motion.div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[15vw] leading-[0.85] tracking-[-0.03em] md:text-[10vw]">
            <RevealOnView delay={0.05}>Let's build</RevealOnView>
            <RevealOnView delay={0.2}>
              <span className="italic">something</span>
              <span className="text-signal cursor">_</span>
            </RevealOnView>
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
            }}
            className="mt-16 grid grid-cols-1 gap-10 min-w-0 md:grid-cols-3"
          >
            <ContactBlock label="Email">
              <a
                href="mailto:davebenaaa@gmail.com"
                className="link-ink break-all font-display text-xl sm:text-2xl md:text-3xl"
              >
                davebenaaa@gmail.com
              </a>
            </ContactBlock>
            <ContactBlock label="Phone">
              <a
                href="tel:+2349114576734"
                className="link-ink break-all font-display text-xl sm:text-2xl md:text-3xl"
              >
                +234 911 4576 734
              </a>
            </ContactBlock>
            <ContactBlock label="Location">
              <div className="font-display text-xl sm:text-2xl md:text-3xl">Nigeria</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Open to remote · WAT (UTC+1)
              </div>
            </ContactBlock>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: 0.6 }}
            className="mt-12"
          >
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              — Socials
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/holydev001"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="font-mono text-xs uppercase tracking-widest">GitHub</span>
              </a>
              <a
                href="https://x.com/holydev0001"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
                <span className="font-mono text-xs uppercase tracking-widest">X / Twitter</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RevealOnView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.12em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ delay, duration: 0.95, ease: [0.7, 0, 0.2, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function ContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } },
      }}
      className="min-w-0"
    >
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        — {label}
      </div>
      {children}
    </motion.div>
  );
}

/* ───────────────────────────── FOOTER ───────────────────────────── */
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-foreground/10 bg-background text-muted-foreground"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-5 py-6 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center md:px-8">
        <span>© {new Date().getFullYear()} David Adams</span>
        <span>Designed & coded </span>
        <span>v1.0 — Last shipped 2026</span>
      </div>
    </motion.footer>
  );
}

/* ───────────────────────────── PRIMITIVES ───────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
      {children}
    </span>
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-6 px-5 py-16 md:px-8 md:py-24">
        <div className="col-span-12 mb-12 grid grid-cols-12 items-end gap-6 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            className="col-span-12 md:col-span-3"
          >
            <Tag>{label}</Tag>
          </motion.div>
          <h2 className="col-span-12 font-display text-5xl leading-[0.95] tracking-[-0.02em] md:col-span-9 md:text-7xl">
            <RevealOnView delay={0.1}>{title}</RevealOnView>
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
