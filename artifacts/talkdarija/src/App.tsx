import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  BookMarked,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Crown,
  Flame,
  Gem,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  LockKeyhole,
  Moon,
  Megaphone,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Trophy,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, Route, Switch, useLocation, useParams } from "wouter";
import {
  achievements,
  avatarOptions,
  clickableVocabulary,
  lessons,
  placementQuestions,
  cultureCards,
  wildScenarios,
  units,
  vocabulary,
  vocabularyCount,
  type Exercise,
  type Level,
} from "@/data/content";
import { useLocalApp } from "@/hooks/use-local-app";
import { playSound } from "@/utils/audio";
import "@/index.css";

const cx = (...items: Array<string | false | undefined>) =>
  items.filter(Boolean).join(" ");
const levelCopy: Record<Level, { title: string; desc: string; unit: number }> =
  {
    A0: {
      title: "Fresh start",
      desc: "You are ready for the everyday basics.",
      unit: 1,
    },
    A1: {
      title: "Warm beginner",
      desc: "You know some useful building blocks.",
      unit: 2,
    },
    A2: {
      title: "Conversation builder",
      desc: "You can make simple exchanges happen.",
      unit: 4,
    },
    B1: {
      title: "Confident connector",
      desc: "You are ready for richer, longer chats.",
      unit: 6,
    },
  };

function Logo() {
  return (
    <Link href="/home" className="focus-ring flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
        <span className="display text-lg font-bold">T</span>
      </span>
      <span className="display text-lg font-bold tracking-tight">
        talk<span className="text-accent">darija</span>
      </span>
    </Link>
  );
}
function AvatarArt({ variant, size = "md" }: { variant: string; size?: "sm" | "md" | "lg" }) {
  const avatar = avatarOptions.find((item) => item.id === variant) ?? avatarOptions[0];
  return <span className={cx("avatar-art", `avatar-art--${size}`)}><img src={avatar.image} alt={avatar.name} /></span>;
}
function Button({
  children,
  className,
  variant = "primary",
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "soft";
  [key: string]: unknown;
}) {
  return (
    <button
      className={cx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:brightness-110",
        variant === "secondary" &&
          "border border-border bg-card hover:bg-muted",
        variant === "soft" && "bg-secondary text-secondary-foreground",
        variant === "ghost" &&
          "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
function Bar({
  value,
  max = 100,
  color = "bg-accent",
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div
        className={cx("progress-fill h-full rounded-full", color)}
        style={{
          width: `${max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0}%`,
        }}
      />
    </div>
  );
}

const vocabularyLookup = new Map(
  Object.entries(clickableVocabulary).map(([key, value]) => [key.toLowerCase(), value]),
);

function normalizeVocabularyToken(token: string) {
  return token
    .replace(/[“”".,!?;:()[\]]/g, "")
    .replace(/^[“\"]|[“\"]$/g, "")
    .trim()
    .toLowerCase();
}

function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,!?;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const exerciseLabel: Record<Exercise["kind"], string> = {
  translation: "Meaning",
  select: "Meaning",
  order: "Build the phrase",
  missing: "Complete the sentence",
  matching: "Match the meaning",
  context: "In context",
  reading: "Reading",
  conversation: "Conversation",
};

function VocabularyWord({ word }: { word: string }) {
  const normalized = normalizeVocabularyToken(word);
  const entry = vocabularyLookup.get(normalized);

  if (!entry) return <>{word}</>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-left align-middle text-primary transition hover:border-primary/50 hover:bg-primary/10"
        >
          <span className="font-semibold">{entry.darija}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64 rounded-2xl border border-border bg-popover p-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <span className="display text-lg font-bold text-primary">{entry.darija}</span>
          <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-secondary-foreground">
            Darija
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">{entry.english}</p>
        {entry.romanization && (
          <p className="mt-1 text-[11px] uppercase tracking-[.12em] text-muted-foreground">
            {entry.romanization}
          </p>
        )}
        {entry.example && (
          <p className="mt-3 rounded-xl bg-muted px-2.5 py-2 text-xs text-muted-foreground">
            “{entry.example}”
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function LessonPromptText({ text }: { text: string }) {
  const tokens = text.split(/(\s+|[“”".,!?;:()\[\]])/g);

  return (
    <>
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token) || /[“”".,!?;:()\[\]]/.test(token)) {
          return <span key={`${token}-${index}`}>{token}</span>;
        }

        if (!token) return null;

        const normalized = normalizeVocabularyToken(token);
        const hasMatch = vocabularyLookup.has(normalized);

        if (hasMatch && token.trim()) {
          return <VocabularyWord key={`${token}-${index}`} word={token} />;
        }

        return <span key={`${token}-${index}`}>{token}</span>;
      })}
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone = "bg-secondary text-primary",
}: {
  icon: typeof Heart;
  value: string | number;
  label: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cx("grid h-9 w-9 place-items-center rounded-xl", tone)}>
        <Icon size={17} />
      </span>
      <span>
        <strong className="block text-sm leading-none">{value}</strong>
        <small className="mt-1 block text-[11px] text-muted-foreground">
          {label}
        </small>
      </span>
    </div>
  );
}
function Sidebar({ current }: { current: string }) {
  const { state } = useLocalApp();
    const nav = [
      { href: "/home", label: "Home", Icon: HomeIcon },
      { href: "/learn", label: "Learn", Icon: GraduationCap },
      { href: "/vocabulary", label: "Words", Icon: BookOpen },
      { href: "/profile", label: "Profile", Icon: UserRound },
    ];
  return (
    <aside className="sidebar fixed inset-y-0 left-0 z-10 w-[232px] flex-col border-r border-sidebar-foreground/10 bg-sidebar px-5 py-6 text-sidebar-foreground">
      <Logo />
      <div className="my-10 px-2 text-[10px] font-bold uppercase tracking-[.18em] opacity-45">
        Your practice
      </div>
      <nav className="space-y-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cx(
              "focus-ring flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold",
              current === item.href
                ? "bg-sidebar-foreground/10 text-accent"
                : "opacity-65 hover:bg-sidebar-foreground/5 hover:opacity-100",
            )}
          >
            <item.Icon size={18} />
            {item.label}
            {current === item.href && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-sidebar-foreground/[.07] p-4">
        <div className="mb-2 flex items-center gap-2 text-accent">
          <Target size={16} />
          <span className="text-xs font-bold">Daily practice</span>
        </div>
        <p className="mb-3 text-xs opacity-60">
          Five minutes today keeps the words close.
        </p>
        <Bar value={state.dailyMinutes} max={state.settings.dailyGoal} />
        <div className="mt-2 text-[11px] opacity-50">
          {state.dailyMinutes} / {state.settings.dailyGoal} min
        </div>
      </div>
          <Link
            href="/settings"
            className="focus-ring mt-5 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold opacity-65 hover:bg-sidebar-foreground/5 hover:opacity-100"
          >
            <SettingsIcon size={18} />
            Settings
          </Link>
    </aside>
  );
}
function BottomNav({ current }: { current: string }) {
  const nav = [
    { href: "/home", label: "Home", Icon: HomeIcon },
    { href: "/learn", label: "Learn", Icon: GraduationCap },
    { href: "/vocabulary", label: "Words", Icon: BookOpen },
    { href: "/profile", label: "Profile", Icon: UserRound },
  ];
  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-border bg-card/95 px-2 py-3 backdrop-blur-md">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cx(
            "focus-ring flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold",
            current === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          <item.Icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const current = location.startsWith("/lesson") ? "/learn" : location;
  return (
    <div className="app-shell noise">
      <Sidebar current={current} />
      <main className="app-main page-in min-h-[100dvh]">
        <div className="mx-auto max-w-[1160px] px-5 py-6 md:px-10 md:py-9">
          {children}
        </div>
      </main>
      <BottomNav current={current} />
    </div>
  );
}
function Header({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[.17em] text-accent">
          {eyebrow}
        </div>
        <h1 className="display text-3xl font-bold tracking-tight md:text-[2.7rem]">
          {title}
        </h1>
      </div>
      {children}
    </header>
  );
}

function Onboarding() {
  const { state, patch } = useLocalApp();
  const [, setLocation] = useLocation();
  const [retake] = useState(
    () =>
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("talkdarija-retake") === "1",
  );
  const [stage, setStage] = useState<
    "welcome" | "self" | "test" | "analyzing" | "result"
  >(retake ? "self" : "welcome");
  const [name, setName] = useState("");
  const [selfLevel, setSelfLevel] = useState("New to Darija");
  const [purpose, setPurpose] = useState("Travel");
  const [dailyGoal, setDailyGoal] = useState(5);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (retake) sessionStorage.removeItem("talkdarija-retake");
    else if (state.profile) setLocation("/home");
  }, [retake, setLocation, state.profile]);
  const q = placementQuestions[Object.keys(answers).length];
  const finish = (next: Record<string, string>) => {
    setScore(
      placementQuestions.reduce(
        (n, item) => n + (next[item.id] === item.answer ? 1 : 0),
        0,
      ),
    );
    setStage("analyzing");
    window.setTimeout(() => setStage("result"), 650);
  };
  const levels: Array<[string, string]> = [
    ["New to Darija", "I am starting from zero"],
    ["A little familiar", "I recognize a few phrases"],
    ["Returning learner", "I have studied before"],
    ["Conversational", "I can make simple chats"],
  ];
  if (stage === "welcome")
    return (
      <div className="pattern flex min-h-[100dvh] items-center justify-center px-5 py-10">
        <div className="w-full max-w-5xl md:grid md:grid-cols-[1.1fr_.9fr] md:items-center md:gap-16">
          <div className="rise">
            <Logo />
            <p className="mt-16 text-sm font-semibold uppercase tracking-[.2em] text-accent">
              A little Darija, every day
            </p>
            <h1 className="display mt-5 text-5xl font-bold leading-[.94] tracking-[-.05em] md:text-7xl">
              Open a door
              <br />
              <span className="text-primary">with your words.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
              Five minutes of useful phrases, warm context, and a path that
              meets you where you are.
            </p>
            <Button
              className="mt-9"
              onClick={() => setStage("self")}
              data-testid="button-start"
            >
              Find my starting point <ChevronRight size={18} />
            </Button>
            <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={15} className="text-primary" /> No account.
              Your progress stays on this device.
            </div>
          </div>
          <div className="relative mt-16 rounded-[2.5rem] border border-border bg-card p-7 shadow-[var(--shadow)] md:mt-0">
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-primary">
              TODAY'S PHRASE
            </span>
            <div className="my-16 text-center">
              <div className="display text-5xl font-bold text-primary">
                bghit atay
              </div>
              <div className="mt-3 text-muted-foreground">I want tea</div>
            </div>
            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              Darija · beginner
            </div>
          </div>
        </div>
      </div>
    );
  if (stage === "self")
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl">
          <Logo />
          <div className="mt-16">
            <div className="mb-5 text-xs font-bold uppercase tracking-[.17em] text-accent">
              Before we begin
            </div>
            <h1 className="display text-4xl font-bold">
              How much Darija
              <br />
              is already in you?
            </h1>
            <p className="mt-4 text-muted-foreground">
              No wrong answers. We will use a short check to make your first
              lesson feel right.
            </p>
            <div className="mt-9 space-y-3">
              {levels.map(([label, detail]) => (
                <button
                  key={label}
                  onClick={() => setSelfLevel(label)}
                  className={cx(
                    "focus-ring flex w-full items-center justify-between rounded-2xl border p-4 text-left",
                    selfLevel === label
                      ? "border-primary bg-secondary"
                      : "border-border bg-card",
                  )}
                >
                  <span>
                    <strong className="block text-sm">{label}</strong>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                  {selfLevel === label && (
                    <Check size={17} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">Why are you learning?
                <select value={purpose} onChange={(event) => setPurpose(event.target.value)} className="focus-ring mt-2 w-full rounded-xl border border-border bg-card px-3 py-3 text-sm font-normal"><option>Travel</option><option>Family</option><option>Friends</option><option>Culture</option><option>Conversation</option></select>
              </label>
              <label className="text-sm font-bold">Daily practice goal
                <select value={dailyGoal} onChange={(event) => setDailyGoal(Number(event.target.value))} className="focus-ring mt-2 w-full rounded-xl border border-border bg-card px-3 py-3 text-sm font-normal"><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option><option value={20}>20+ minutes</option></select>
              </label>
            </div>
            <Button
              className="mt-8 w-full"
              onClick={() => setStage("test")}
              data-testid="button-continue-self"
            >
              Continue to quick check <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  if (stage === "test" && q) {
    const qIndex = Object.keys(answers).length;
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <Logo />
            <span className="text-xs font-bold text-muted-foreground">
              {qIndex + 1} / {placementQuestions.length}
            </span>
          </div>
          <div className="mt-9">
            <Bar value={qIndex} max={placementQuestions.length} />
            <div className="mt-12 text-xs font-bold uppercase tracking-[.16em] text-accent">
              {q.category} · level {q.difficulty}
            </div>
            <h1 className="display mt-4 text-3xl font-bold md:text-4xl">
              {q.prompt}
            </h1>
            <div className="mt-8 grid gap-3">
              {q.options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => {
                    const next = { ...answers, [q.id]: option };
                    setAnswers(next);
                    if (qIndex === placementQuestions.length - 1) finish(next);
                  }}
                  data-testid={`button-placement-option-${i}`}
                  className="focus-ring rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold hover:border-primary hover:bg-secondary"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <CircleHelp size={15} /> Go with your first instinct.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (stage === "analyzing")
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-5 text-center">
        <div>
          <Sparkles className="mx-auto text-accent" size={42} />
          <h1 className="display mt-7 text-3xl font-bold">
            Reading your rhythm…
          </h1>
          <p className="mt-3 text-muted-foreground">
            Finding a gentle place to begin.
          </p>
        </div>
      </div>
    );
  const level: Level =
    score < 4 ? "A0" : score < 7 ? "A1" : score < 10 ? "A2" : "B1";
  const rec = levelCopy[level];
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 py-10 text-center">
      <div className="w-full max-w-2xl">
        <Logo />
        <Trophy className="mx-auto mt-14 text-accent" size={42} />
        <p className="mt-7 text-xs font-bold uppercase tracking-[.17em] text-accent">
          Your starting point
        </p>
        <h1 className="display mt-3 text-5xl font-bold">{rec.title}</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          {rec.desc} You got{" "}
          <strong className="text-foreground">{score} of 12</strong>.
        </p>
        <div className="mx-auto mt-9 max-w-md rounded-2xl border border-border bg-card p-5 text-left">
          <strong className="text-sm">
            Recommended path · Unit {rec.unit}
          </strong>
          <p className="mt-2 text-sm text-muted-foreground">
            {units[rec.unit - 1].title}: {units[rec.unit - 1].description}
          </p>
        </div>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="What should we call you?"
          data-testid="input-name"
          className="focus-ring mt-6 w-full max-w-md rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none"
        />
        <Button
          className="mt-4 w-full max-w-md"
          onClick={() => {
            patch({
              profile: {
                name: name.trim() || "Darija learner",
                avatar: avatarOptions[0].id,
                level,
                score,
                selfLevel,
                purpose,
                startedAt: new Date().toISOString(),
              },
              settings: { ...state.settings, dailyGoal },
              currentLessonId: `lesson-${(rec.unit - 1) * 5 + 1}`,
            });
            setLocation("/home");
          }}
          data-testid="button-enter-app"
        >
          Start my path <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}

const todayKey = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function DailyQuests({ state }: { state: ReturnType<typeof useLocalApp>["state"] }) {
  const activeToday = state.dailyQuestDate === todayKey();
  const lessonsDone = activeToday ? state.dailyLessons : 0;
  const wordsDone = activeToday ? state.dailyWords : 0;
  const exercisesDone = activeToday ? state.dailyExercises : 0;
  const quests = [
    { label: "Complete a lesson", value: lessonsDone, goal: 1, Icon: GraduationCap },
    { label: "Learn 5 new words", value: wordsDone, goal: 5, Icon: BookMarked },
    { label: "Complete 10 exercises", value: exercisesDone, goal: 10, Icon: CheckCircle2 },
    { label: "Review 5 mistakes", value: activeToday ? state.dailyMistakesReviewed : 0, goal: 5, Icon: RotateCcw },
    { label: "Keep your streak alive", value: activeToday && state.streak > 0 ? 1 : 0, goal: 1, Icon: Flame },
  ];
  const completed = quests.filter((quest) => quest.value >= quest.goal).length;
  return (
    <section className="rounded-[1.7rem] border border-border bg-card p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Small steps, real momentum</p>
          <h2 className="display mt-2 text-2xl font-bold">Daily quests</h2>
          <p className="mt-1 text-sm text-muted-foreground">A few minutes today keeps Darija close.</p>
        </div>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">{completed}/{quests.length} complete</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {quests.map((quest) => {
          const done = quest.value >= quest.goal;
          return (
            <div key={quest.label} className={cx("rounded-2xl border p-4", done ? "border-primary/30 bg-primary/5" : "border-border")}>
              <div className="flex items-center gap-3">
                <span className={cx("grid h-9 w-9 place-items-center rounded-xl", done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {done ? <Check size={17} /> : <quest.Icon size={17} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-sm font-bold">
                    <span>{quest.label}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{Math.min(quest.value, quest.goal)}/{quest.goal}</span>
                  </div>
                  <div className="mt-2"><Bar value={quest.value} max={quest.goal} color={done ? "bg-primary" : "bg-accent"} /></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Leaderboard({ state }: { state: ReturnType<typeof useLocalApp>["state"] }) {
  return (
    <section className="rounded-[1.7rem] border border-border bg-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">A future place to meet learners</p>
          <h2 className="display mt-2 text-2xl font-bold">Weekly leaderboard</h2>
        </div>
        <Trophy className="text-accent" size={24} />
      </div>
      <div className="mt-6 rounded-2xl bg-secondary/65 p-5">
        <div className="flex items-start gap-3">
          <Award className="mt-0.5 shrink-0 text-primary" size={20} />
          <div>
            <p className="text-sm font-bold">Live rankings are not connected yet.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              TalkDarija currently saves progress on this device, without accounts or a shared server. Once accounts are available, this panel is ready for weekly XP and rank data.
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs">
          <span className="text-muted-foreground">Your local XP</span>
          <strong className="text-primary">{state.xp} XP</strong>
        </div>
      </div>
    </section>
  );
}

function PremiumCard({ premium }: { premium: boolean }) {
  return (
    <section className="rounded-[1.7rem] border border-accent/30 bg-secondary/60 p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Crown size={19} /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">TalkDarija premium</p>
            <h2 className="display mt-2 text-2xl font-bold">A calmer, ad-free practice space</h2>
          </div>
        </div>
        {premium && <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">Ad-free active</span>}
      </div>
      <div className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-2"><Check size={15} className="text-primary" /> Remove advertisements</span>
        <span className="flex items-center gap-2"><Check size={15} className="text-primary" /> Future premium features</span>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="primary" disabled={premium} onClick={() => window.alert("Premium checkout is not connected yet. No payment information was collected.")}>
          {premium ? "Premium active" : "Go premium"} <ChevronRight size={16} />
        </Button>
        <span className="text-xs text-muted-foreground">Payments will be connected in a future release.</span>
      </div>
    </section>
  );
}

function HomePage() {
  const { state } = useLocalApp();
  const lesson =
    lessons.find((item) => item.id === state.currentLessonId) ?? lessons[0];
  const unit = units[lesson.unitId - 1];
  return (
    <Shell>
      <Header
        eyebrow={`Salam, ${state.profile?.name || "friend"}`}
        title="Your little corner of Darija"
      >
        <div className="flex gap-3">
          <AvatarArt variant={state.profile?.avatar || avatarOptions[0].id} size="sm" />
          <Stat
            icon={Flame}
            value={state.streak}
            label="day streak"
            tone="bg-secondary text-accent"
          />
          <Stat
            icon={Heart}
            value={state.hearts}
            label="hearts"
            tone="bg-secondary text-destructive"
          />
        </div>
      </Header>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
        <section className="rounded-[1.7rem] bg-primary p-7 text-primary-foreground shadow-[var(--shadow)] md:p-9">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" /> Continue where
            you left off
          </div>
          <h2 className="display mt-5 text-3xl font-bold md:text-4xl">
            Unit {lesson.unitId}: {unit.title}
          </h2>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/70">
            {unit.description} Next up:{" "}
            <strong className="text-primary-foreground">{lesson.title}</strong>.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/lesson/${lesson.id}`}
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground"
              data-testid="link-continue-lesson"
            >
              Keep going <ChevronRight size={17} />
            </Link>
          </div>
        </section>
        <section className="rounded-[1.7rem] border border-border bg-card p-6">
          <div className="flex justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <Target size={17} className="text-accent" /> Daily goal
            </span>
            <span className="text-xs text-muted-foreground">
              {state.dailyMinutes} / {state.settings.dailyGoal} min
            </span>
          </div>
          <div className="mt-5">
            <Bar value={state.dailyMinutes} max={state.settings.dailyGoal} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {state.dailyMinutes >= state.settings.dailyGoal
              ? "Goal met. Nti mzyana."
              : "Three minutes can change the shape of a day."}
          </p>
          <div className="mt-6 flex gap-3 border-t border-border pt-5">
            <Stat icon={Gem} value={state.diamonds} label="diamonds" />
            <Stat
              icon={Sparkles}
              value={state.xp}
              label="total XP"
              tone="bg-secondary text-accent"
            />
          </div>
        </section>
      </div>
      <div className="mt-5">
        <DailyQuests state={state} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[1.7rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Your path</p>
              <h2 className="display mt-2 text-2xl font-bold">Learning snapshot</h2>
            </div>
            <Link href="/profile" className="focus-ring text-xs font-bold text-primary">View profile <ChevronRight size={14} className="inline" /></Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-secondary p-4"><BookOpen size={18} className="text-primary" /><strong className="mt-3 block text-2xl">{state.completedLessons.length}</strong><span className="text-xs text-muted-foreground">lessons done</span></div>
            <div className="rounded-2xl bg-secondary p-4"><BookMarked size={18} className="text-primary" /><strong className="mt-3 block text-2xl">{state.learnedWords.length}</strong><span className="text-xs text-muted-foreground">words saved</span></div>
            <div className="rounded-2xl bg-secondary p-4"><Flame size={18} className="text-accent" /><strong className="mt-3 block text-2xl">{state.streak}</strong><span className="text-xs text-muted-foreground">day streak</span></div>
            <div className="rounded-2xl bg-secondary p-4"><Sparkles size={18} className="text-accent" /><strong className="mt-3 block text-2xl">{state.xp}</strong><span className="text-xs text-muted-foreground">total XP</span></div>
          </div>
        </section>
        {!state.premium && (
          <aside className="rounded-[1.7rem] border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground"><Megaphone size={14} /> Advertisement</div>
            <div className="mt-4 grid min-h-[145px] place-items-center rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center">
              <div><p className="text-sm font-bold text-muted-foreground">A small space for a future sponsor</p><p className="mt-1 text-xs text-muted-foreground/75">Ads will stay separate from your lessons.</p></div>
            </div>
          </aside>
        )}
      </div>
      <section className="mt-5 rounded-[1.7rem] border border-border bg-card p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Keep the tricky bits close</p>
            <h2 className="display mt-2 text-2xl font-bold">Review mistakes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {state.mistakeExerciseIds.length ? `${state.mistakeExerciseIds.length} exercise${state.mistakeExerciseIds.length === 1 ? "" : "s"} waiting for another try.` : "Nothing waiting. You are keeping up nicely."}
            </p>
          </div>
          <Link href="/review" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-primary" aria-label="Open mistake review">
            Review now <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      <div className="mt-5"><Leaderboard state={state} /></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-[1.7rem] border border-border bg-card p-6 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Darija in the wild</p>
          <h2 className="display mt-2 text-2xl font-bold">Useful phrases for real places</h2>
          <p className="mt-1 text-sm text-muted-foreground">Practice the kind of short exchange you might actually have in Morocco.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {wildScenarios.slice(0, 2).map((scenario) => <Link key={scenario.id} href={`/scenarios/${scenario.id}`} className="focus-ring rounded-2xl border border-border p-4 hover:border-primary hover:bg-secondary"><span className="text-xs font-bold text-accent">{scenario.setting}</span><strong className="mt-2 block text-sm">{scenario.title}</strong><span className="mt-2 block text-xs text-muted-foreground">{scenario.meaning}</span></Link>)}
          </div>
        </section>
        <section className="moroccan-arch relative overflow-hidden rounded-[1.7rem] border border-border bg-secondary/60 p-6 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Morocco in a minute</p>
          <h2 className="display mt-2 text-2xl font-bold">{cultureCards[0].title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cultureCards[0].text}</p>
          <div className="mt-5 rounded-xl bg-card/70 p-3"><strong className="text-primary">{cultureCards[0].phrase}</strong><span className="ml-2 text-xs text-muted-foreground">{cultureCards[0].meaning}</span></div>
        </section>
      </div>
      <div className="mt-5"><PremiumCard premium={state.premium} /></div>
      <footer className="mt-8 border-t border-border pt-5 text-center text-xs text-muted-foreground">TalkDarija · useful words, a little every day</footer>
    </Shell>
  );
}

function LearnPage() {
  const { state } = useLocalApp();
  return (
    <Shell>
      <Header eyebrow="The course" title="A path made for real life">
        <div className="hidden rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground md:block">
          <span className="font-bold text-primary">
            {state.completedLessons.length}
          </span>{" "}
          / {lessons.length} lessons
        </div>
      </Header>
      <div className="mb-8 rounded-2xl bg-secondary p-5">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
          Your route
        </p>
        <h2 className="display mt-1 text-xl font-bold">
          From “salam” to “hder m3aya”
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {units.length} units · four levels · one growing practice
        </p>
        <div className="mt-4">
          <Bar
            value={state.completedLessons.length}
            max={lessons.length}
            color="bg-primary"
          />
        </div>
      </div>
      <div className="space-y-4">
        {units.map((unit, index) => {
          const unitLessons = lessons.filter((item) => item.unitId === unit.id);
          const completed = unitLessons.filter((item) =>
            state.completedLessons.includes(item.id),
          ).length;
          const unlocked =
            index === 0 ||
            lessons
              .filter((item) => item.unitId < unit.id)
              .every((item) => state.completedLessons.includes(item.id));
          return (
            <section
              key={unit.id}
              className={cx(
                "rounded-[1.5rem] border border-border bg-card p-5 md:p-6",
                !unlocked && "opacity-65",
              )}
            >
              <div className="flex gap-4">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: unit.color }}
                >
                  {unlocked ? unit.id : <LockKeyhole size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.13em] text-muted-foreground">
                        Unit {unit.id} · {unit.level}
                      </p>
                      <h2 className="display mt-1 text-xl font-bold">
                        {unit.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {unit.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {completed}/{unitLessons.length}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-5">
                    {unitLessons.map((item) => (
                      <Link
                        key={item.id}
                        href={unlocked ? `/lesson/${item.id}` : "#"}
                        onClick={(event) => !unlocked && event.preventDefault()}
                        className={cx(
                          "focus-ring rounded-xl border p-3",
                          state.completedLessons.includes(item.id)
                            ? "border-primary/30 bg-primary/5"
                            : item.id === state.currentLessonId
                              ? "border-primary bg-secondary"
                              : "border-border hover:bg-muted",
                        )}
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-muted text-[10px] font-bold">
                          {state.completedLessons.includes(item.id) ? (
                            <Check size={13} />
                          ) : (
                            item.number
                          )}
                        </span>
                        <p className="mt-3 line-clamp-2 text-xs font-bold">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {item.duration} min · {item.type === "story" ? "Story practice" : item.type === "unit-test" ? "Unit review" : item.type === "review" ? "Review" : "Lesson"}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}

function LessonPage() {
  const { state, patch, completeLesson, recordExercise, recordMistake } = useLocalApp();
  const params = useParams<{ lessonId: string }>();
  const [, setLocation] = useLocation();
  const lesson =
    lessons.find((item) => item.id === params.lessonId) ?? lessons[0];
  const [index, setIndex] = useState(() =>
    Math.min(
      state.currentLessonId === lesson.id ? state.currentQuestion : 0,
      lesson.exercises.length - 1,
    ),
  );
  const [selected, setSelected] = useState(
    state.savedAnswers[`${lesson.id}-${index}`] || "",
  );
  const [checked, setChecked] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const exercise: Exercise | undefined =
    lesson.exercises[index] ?? lesson.exercises[0];
  if (!exercise)
    return (
      <div className="p-8 text-center">
        This lesson is taking a short pause.
      </div>
    );
  const isBuild = Boolean(exercise.words) || exercise.kind === "order";
  const options = exercise.options ?? exercise.words ?? [];
  const isCorrect = (value: string) =>
    normalizeAnswer(value) === normalizeAnswer(exercise.answer);
  const choose = (value: string) => {
    if (checked) return;
    const next = isBuild ? (selected ? `${selected} ${value}` : value) : value;
    const correct = isCorrect(next);
    setSelected(next);
    if (
      !isBuild ||
      correct ||
      next.split(" ").length >= exercise.answer.split(" ").length
    ) {
      setChecked(true);
      setWrong(!correct);
      patch({
        savedAnswers: {
          ...state.savedAnswers,
          [`${lesson.id}-${index}`]: next,
        },
        currentLessonId: lesson.id,
        currentQuestion: index,
        hearts: correct ? state.hearts : Math.max(0, state.hearts - 1),
      });
      playSound(correct ? "correct" : "incorrect", state.settings.sound);
      if (correct) playSound("xp", state.settings.sound);
      else playSound("heart-lost", state.settings.sound);
      if (correct) recordExercise();
      else {
        setMistakes((value) => value + 1);
        recordMistake(exercise.id);
      }
    }
  };
  const next = () => {
    if (index === lesson.exercises.length - 1) {
      setCelebrating(true);
      playSound("lesson-complete", state.settings.sound);
      window.setTimeout(
        () => {
          const earnedXp = Math.max(1, Math.round(lesson.xp * (1 - mistakes / lesson.exercises.length)));
          completeLesson(lesson.id, earnedXp, lesson.duration);
          setLocation("/home");
        },
        state.settings.animations ? 850 : 0,
      );
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setSelected(state.savedAnswers[`${lesson.id}-${nextIndex}`] || "");
    setChecked(false);
    setWrong(false);
    patch({ currentLessonId: lesson.id, currentQuestion: nextIndex });
    playSound("click", state.settings.sound);
  };
  return (
    <div className="min-h-[100dvh] bg-background px-5 py-5 md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <Link
            href="/learn"
            className="focus-ring flex items-center gap-2 text-sm font-bold text-muted-foreground"
          >
            <X size={18} /> Exit
          </Link>
          <span className="flex items-center gap-4 text-sm font-bold">
            <span className="text-destructive">
              <Heart size={17} fill="currentColor" className="inline" />{" "}
              {state.hearts}
            </span>
            <span className="text-xs text-muted-foreground">
              {index + 1}/{lesson.exercises.length}
            </span>
          </span>
        </header>
        <div className="mt-6">
          <Bar value={index} max={lesson.exercises.length} />
        </div>
        <div
          className={cx(
            "mx-auto mt-14 max-w-2xl",
            wrong ? "answer-wrong" : checked ? "answer-correct" : "",
          )}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-accent">
            {lesson.title} · {exerciseLabel[exercise.kind]}
          </div>
          <h1 className="display mt-4 text-3xl font-bold md:text-4xl">
            <LessonPromptText text={exercise.prompt} />
          </h1>
          {exercise.hint && (
            <p className="mt-3 text-sm text-muted-foreground">
              {exercise.hint}
            </p>
          )}
          {isBuild && (
            <div className="mt-5 min-h-12 rounded-xl border border-dashed border-primary/40 bg-secondary/40 p-3 text-sm font-bold text-primary">
              {selected || "Choose words below"}
            </div>
          )}
          <div className="mt-5 space-y-3">
            {options.map((option, i) => {
              const picked = isBuild
                ? selected.split(" ").includes(option)
                : selected === option;
              return (
                <button
                  key={`${option}-${i}`}
                  onClick={() => choose(option)}
                  disabled={checked}
                  className={cx(
                    "focus-ring flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left text-sm font-semibold",
                    picked && !checked && "border-primary bg-primary/10",
                    checked &&
                      normalizeAnswer(option) === normalizeAnswer(exercise.answer) &&
                      "border-primary bg-primary/10",
                    checked &&
                      picked &&
                      wrong &&
                      "border-destructive bg-destructive/10",
                    !checked &&
                      "border-border hover:border-primary hover:bg-secondary",
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-xs">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {picked && <Check size={18} className="text-primary" />}
                </button>
              );
            })}
          </div>
          {checked && (
            <div
              className={cx(
                "mt-6 rounded-2xl border p-5",
                wrong
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-primary/30 bg-primary/10",
              )}
            >
              <div className="flex items-center gap-2 font-bold">
                {wrong ? (
                  <>
                    <X size={18} className="text-destructive" />
                    Not quite — keep going.
                  </>
                ) : (
                  <>
                    <Check size={18} className="text-primary" />
                    Mzyan! That landed.
                  </>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <LessonPromptText text={exercise.explanation} />{" "}
                <strong className="text-foreground">
                  Answer: <LessonPromptText text={exercise.answer} />
                </strong>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {wrong && <Button variant="secondary" onClick={() => { setSelected(""); setChecked(false); setWrong(false); }}>Try again</Button>}
                <Button onClick={next}>
                  {index === lesson.exercises.length - 1 ? "Finish lesson" : "Continue"} <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {state.hearts === 0 && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-background/85 px-5 backdrop-blur-sm">
          <div className="rounded-[2rem] border border-border bg-card p-7 text-center shadow-[var(--shadow)]">
            <Heart
              className="mx-auto text-destructive"
              size={38}
              fill="currentColor"
            />
            <h2 className="display mt-4 text-2xl font-bold">
              You’re out of hearts
            </h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Your exact place is saved. Take a breath, then restore one heart and keep practicing.
            </p>
            <Button
              className="mt-5 w-full"
              onClick={() => {
                patch({ hearts: 1 });
                playSound("heart-gained", state.settings.sound);
              }}
            >
              Restore one heart
            </Button>
            <Link
              href="/home"
              className="focus-ring mt-4 inline-block text-xs font-bold text-muted-foreground"
            >
              Save and leave
            </Link>
          </div>
        </div>
      )}
      {celebrating && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-background/85 px-5 backdrop-blur-sm">
          <div className="celebrate rounded-[2rem] border border-accent/30 bg-card p-9 text-center shadow-[var(--shadow)]">
            <Trophy className="mx-auto text-accent" size={38} />
            <h2 className="display mt-4 text-3xl font-bold">Lesson complete</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your next phrase is waiting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function VocabularyPage() {
  const { state, markWordLearned } = useLocalApp();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [review, setReview] = useState(false);
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(vocabulary.map((word) => word.category))),
    ],
    [],
  );
  const filtered = useMemo(
    () =>
      vocabulary.filter(
        (word) =>
          (category === "All" || word.category === category) &&
          (!query ||
            `${word.darija} ${word.english}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [category, query],
  );
  const visible = useMemo(() => {
    const matches = review
      ? filtered.filter((word) => state.learnedWords.includes(word.id))
      : filtered;
    if (query || category !== "All" || review) return matches.slice(0, 24);
    const saved = matches.filter((word) =>
      state.learnedWords.includes(word.id),
    );
    return [
      ...saved,
      ...matches
        .filter((word) => !state.learnedWords.includes(word.id))
        .slice(0, 12),
    ].slice(0, 18);
  }, [category, filtered, query, review, state.learnedWords]);
  const toggle = (id: string) => markWordLearned(id);
  return (
    <Shell>
      <Header eyebrow="Your word shelf" title="Words worth keeping">
        <Button variant="soft" onClick={() => setReview(!review)}>
          <RotateCcw size={16} />
          {review ? "All words" : "Review due"}
        </Button>
      </Header>
      <div className="mb-5 flex justify-between text-xs text-muted-foreground">
        <span>
          <strong className="text-primary">{vocabularyCount}</strong> useful
          cards across four levels
        </span>
        <span>{visible.length} showing</span>
      </div>
      <div className="vocabulary-toolbar">
        <label className="vocabulary-search flex items-center gap-3 rounded-xl border bg-card px-4">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Darija or English…"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <div className="vocabulary-filters">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={cx(
                "vocabulary-filter focus-ring whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold",
                category === item && "is-active",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((word) => {
          const learned = state.learnedWords.includes(word.id);
          return (
            <article
              key={word.id}
              className="vocabulary-card card-lift rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div>
                    <div className="vocabulary-term display text-left text-2xl font-bold text-primary">
                      {word.darija}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {state.settings.showTransliteration ? `${word.romanization} · ` : ""}{word.level}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(word.id)}
                  className={cx(
                    "focus-ring rounded-xl p-2",
                    learned
                      ? "bg-secondary text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-label={
                    learned ? "Mark word for review" : "Mark word learned"
                  }
                >
                  <Check size={17} />
                </button>
              </div>
              <p className="vocabulary-translation mt-4 font-bold">{word.english}</p>
              <div className="vocabulary-example mt-2 flex items-start gap-2">
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  “{word.example}”
                </p>
              </div>
              <div className="mt-5 flex justify-between border-t border-border pt-3 text-[10px] font-semibold text-muted-foreground">
                <span>{word.category}</span>
                <span>
                  {learned ? "Saved for review" : "Not saved yet"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={28} />
          <h2 className="display mt-4 text-lg font-bold">Nothing here yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or mark a few words for review.
          </p>
        </div>
      )}
      <div className="mt-8 rounded-[1.7rem] border border-accent/30 bg-secondary/60 p-6">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-1 text-primary" size={20} />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
              The big dictionary is backstage
            </p>
            <h2 className="display mt-2 text-2xl font-bold">
              1,000+ Darija words are waiting in the wings.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The full word pile stays tucked away so TalkDarija stays quick on
              a phone. Your saved shelf remains ready for review.
            </p>
          </div>
        </div>
      </div>
      <div className="vocabulary-summary mt-8">
        <div className="vocabulary-summary-card rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-xs opacity-70">Words learned</p>
          <strong className="display mt-2 block text-3xl">
            {state.learnedWords.length}
          </strong>
        </div>
        <div className="vocabulary-summary-card rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Cards saved</p>
          <strong className="display mt-2 block text-3xl text-primary">
            {state.learnedWords.length}
          </strong>
        </div>
        <div className="vocabulary-summary-card rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Ready for review</p>
          <strong className="display mt-2 block text-3xl text-accent">
            {state.learnedWords.length}
          </strong>
        </div>
      </div>
    </Shell>
  );
}

function ReviewPage() {
  const { state, recordMistakeReview, recordMistake } = useLocalApp();
  const [currentId, setCurrentId] = useState(state.mistakeExerciseIds[0] || "");
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const exercise = lessons.flatMap((lesson) => lesson.exercises).find((item) => item.id === currentId);
  if (!exercise) {
    return (
      <Shell>
        <Header eyebrow="A calmer second look" title="Review mistakes" />
        <section className="mx-auto max-w-xl rounded-[1.7rem] border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto text-primary" size={36} />
          <h2 className="display mt-4 text-2xl font-bold">Nothing to review</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your missed questions will appear here after you practice.</p>
          <Link href="/learn" className="focus-ring mt-6 inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">Back to lessons</Link>
        </section>
      </Shell>
    );
  }
  const options = exercise.options ?? exercise.words ?? [];
  const isBuild = Boolean(exercise.words) || exercise.kind === "order";
  const correct = normalizeAnswer(selected) === normalizeAnswer(exercise.answer);
  const choose = (value: string) => {
    if (checked) return;
    const next = isBuild ? (selected ? `${selected} ${value}` : value) : value;
    setSelected(next);
    if (!isBuild || next.split(" ").length >= exercise.answer.split(" ").length) setChecked(true);
  };
  const nextReview = () => {
    if (!correct) {
      recordMistake(exercise.id);
      setChecked(false);
      setSelected("");
      return;
    }
    recordMistakeReview(exercise.id);
    const nextId = state.mistakeExerciseIds.find((id) => id !== exercise.id) || "";
    setCurrentId(nextId);
    setSelected("");
    setChecked(false);
  };
  return (
    <Shell>
      <Header eyebrow="A calmer second look" title="Review mistakes">
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">{state.mistakeExerciseIds.length} waiting</span>
      </Header>
      <section className="mx-auto max-w-2xl rounded-[1.7rem] border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">{exerciseLabel[exercise.kind]}</p>
        <h1 className="display mt-4 text-3xl font-bold"><LessonPromptText text={exercise.prompt} /></h1>
        {isBuild && <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-secondary/40 p-3 text-sm font-bold text-primary">{selected || "Choose words below"}</div>}
        <div className="mt-6 space-y-3">
          {options.map((option, index) => <button key={`${option}-${index}`} type="button" disabled={checked} onClick={() => choose(option)} className={cx("focus-ring flex w-full items-center gap-4 rounded-2xl border bg-background p-4 text-left text-sm font-semibold", selected === option && !checked && "border-primary bg-primary/10", checked && normalizeAnswer(option) === normalizeAnswer(exercise.answer) && "border-primary bg-primary/10", !checked && "border-border hover:border-primary hover:bg-secondary")}><span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-xs">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}
        </div>
        {checked && <div className={cx("mt-6 rounded-2xl border p-5", correct ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10")}><p className="font-bold">{correct ? "Mzyan! That one is back." : "Not quite yet. Try it once more."}</p><p className="mt-2 text-sm text-muted-foreground">Answer: <strong className="text-foreground"><LessonPromptText text={exercise.answer} /></strong></p><Button className="mt-4" onClick={nextReview}>{correct ? "Next review" : "Try again"} <ChevronRight size={16} /></Button></div>}
      </section>
    </Shell>
  );
}

function ScenarioPage() {
  const params = useParams<{ scenarioId: string }>();
  const { recordExercise } = useLocalApp();
  const scenario = wildScenarios.find((item) => item.id === params.scenarioId) ?? wildScenarios[0];
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const options = [scenario.response, "bslama", "chno smitek?", "ma fhemtch"].sort();
  const correct = normalizeAnswer(selected) === normalizeAnswer(scenario.response);
  return (
    <Shell>
      <Header eyebrow="Darija in the wild" title={scenario.title}>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">{scenario.level}</span>
      </Header>
      <section className="mx-auto max-w-2xl rounded-[1.7rem] border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-accent">{scenario.setting}</p>
        <h1 className="display mt-4 text-3xl font-bold">{scenario.prompt}</h1>
        <div className="mt-6 space-y-3">{options.map((option, index) => <button key={option} type="button" disabled={checked} onClick={() => { setSelected(option); setChecked(true); if (normalizeAnswer(option) === normalizeAnswer(scenario.response)) recordExercise(); }} className={cx("focus-ring flex w-full items-center gap-4 rounded-2xl border bg-background p-4 text-left text-sm font-semibold", checked && normalizeAnswer(option) === normalizeAnswer(scenario.response) && "border-primary bg-primary/10", checked && selected === option && !correct && "border-destructive bg-destructive/10", !checked && "border-border hover:border-primary hover:bg-secondary")}><span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-xs">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}</div>
        {checked && <div className={cx("mt-6 rounded-2xl border p-5", correct ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10")}><p className="font-bold">{correct ? "Mzyan! That works." : "Not quite. Try the phrase that fits the situation."}</p><p className="mt-2 text-sm text-muted-foreground">{scenario.note}</p><p className="mt-3 text-sm"><strong className="text-primary">{scenario.response}</strong><span className="ml-2 text-muted-foreground">{scenario.meaning}</span></p><Link href="/home" className="focus-ring mt-4 inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">Back home</Link></div>}
      </section>
    </Shell>
  );
}

function ProfilePage() {
  const { state, patch, reset } = useLocalApp();
  const [, setLocation] = useLocation();
  const profile = state.profile;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [avatar, setAvatar] = useState(profile?.avatar || avatarOptions[0].id);
  const [error, setError] = useState("");
  const retake = () => {
    sessionStorage.setItem("talkdarija-retake", "1");
    setLocation("/");
  };
  return (
    <Shell>
      <Header
        eyebrow="Your learner card"
        title={`Aji, ${profile?.name || "friend"}`}
      >
        <Link
          href="/settings"
          aria-label="Open settings"
          className="focus-ring rounded-xl border border-border bg-card p-3"
        >
          <SettingsIcon size={18} />
        </Link>
      </Header>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[1.7rem] bg-primary p-7 text-primary-foreground">
          <AvatarArt variant={profile?.avatar || avatarOptions[0].id} size="lg" />
          <h2 className="display mt-6 text-2xl font-bold">{profile?.name}</h2>
          <p className="mt-1 text-sm opacity-65">
            {levelCopy[profile?.level || "A0"].title}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-primary-foreground/15 pt-5">
            <div>
              <strong className="block text-xl">{state.xp}</strong>
              <span className="text-[11px] opacity-60">XP earned</span>
            </div>
            <div>
              <strong className="block text-xl">{state.streak}</strong>
              <span className="text-[11px] opacity-60">day streak</span>
            </div>
            <div>
              <strong className="block text-xl">
                {state.learnedWords.length}
              </strong>
              <span className="text-[11px] opacity-60">words learned</span>
            </div>
          </div>
        </section>
        <section className="rounded-[1.7rem] border border-border bg-card p-6">
          <div className="flex justify-between">
            <h2 className="display text-xl font-bold">Achievements</h2>
            <span className="text-xs text-muted-foreground">
              {state.achievements.length}/{achievements.length} unlocked
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={cx(
                  "rounded-xl border p-3",
                  state.achievements.includes(item.id)
                    ? "border-accent/40 bg-accent/5"
                    : "border-border opacity-45",
                )}
              >
                <strong className="block text-xs">{item.title}</strong>
                <span className="text-[11px] text-muted-foreground">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="display text-xl font-bold">Personalize your learner card</h2>
            <p className="mt-1 text-sm text-muted-foreground">These details stay on this device. No image is uploaded.</p>
          </div>
          {!editing && <Button variant="secondary" onClick={() => { setName(profile?.name || ""); setAvatar(profile?.avatar || avatarOptions[0].id); setEditing(true); }}>Change avatar</Button>}
        </div>
        {editing && (
          <div className="mt-5 max-w-xl">
            <label className="block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground" htmlFor="profile-name">Username</label>
            <input id="profile-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none" maxLength={24} />
            {error && <p role="alert" className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
            <p className="mt-4 text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Choose a local avatar</p>
            <div className="mt-2 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {avatarOptions.map((option) => <button key={option.id} type="button" aria-label={`Choose ${option.name} avatar: ${option.description}`} aria-pressed={avatar === option.id} onClick={() => setAvatar(option.id)} className={cx("avatar-choice focus-ring rounded-2xl border p-1.5", avatar === option.id ? "is-selected border-primary bg-secondary" : "border-border bg-background")}><AvatarArt variant={option.id} size="md" /><span className="avatar-choice__name">{option.name}</span></button>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => { const clean = name.trim(); if (!/^[A-Za-z0-9][A-Za-z0-9 _-]{1,23}$/.test(clean)) { setError("Use 2–24 letters, numbers, spaces, hyphens, or underscores."); return; } patch({ profile: profile ? { ...profile, name: clean, avatar } : profile }); setEditing(false); }}>Save changes</Button>
              <Button variant="ghost" onClick={() => { setEditing(false); setError(""); }}>Cancel</Button>
            </div>
          </div>
        )}
      </section>
      <section className="mt-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="display text-xl font-bold">Your settings shortcuts</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={retake}>
            <RotateCcw size={16} /> Retake placement test
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all TalkDarija progress? This cannot be undone.",
                )
              ) {
                reset();
                setLocation("/");
              }
            }}
          >
            <X size={16} /> Reset progress
          </Button>
        </div>
      </section>
    </Shell>
  );
}

function SettingsPage() {
  const { state, patch, reset } = useLocalApp();
  const [, setLocation] = useLocation();
  const update = (settings: Partial<typeof state.settings>) =>
    patch({ settings: { ...state.settings, ...settings } });
  const retake = () => {
    sessionStorage.setItem("talkdarija-retake", "1");
    setLocation("/");
  };
  const toggle = (key: "sound" | "animations") =>
    update({ [key]: !state.settings[key] });
  return (
    <Shell>
      <Header eyebrow="Make it yours" title="Settings" />
      <div className="mx-auto max-w-2xl space-y-4">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="display text-lg font-bold">Look & feel</h2>
          <div className="mt-4 divide-y divide-border">
            <div className="flex items-center justify-between py-4">
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                  {state.settings.theme === "light" ? (
                    <Sun size={17} />
                  ) : (
                    <Moon size={17} />
                  )}
                </span>
                <span>
                  <strong className="block text-sm">Theme</strong>
                  <small className="text-xs text-muted-foreground">
                    Choose your study atmosphere
                  </small>
                </span>
              </span>
              <div className="flex gap-1 rounded-xl border border-border bg-background p-1">
                {(["light", "dark", "system"] as const).map((theme) => <button key={theme} type="button" aria-pressed={state.settings.theme === theme} onClick={() => update({ theme })} className={cx("focus-ring rounded-lg px-2.5 py-2 text-xs font-bold capitalize", state.settings.theme === theme ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{theme}</button>)}
              </div>
            </div>
            {(
              [
                [
                  "sound",
                  "Sound effects",
                  "Correct, XP, unlock, and progress cues",
                ],
                ["animations", "Motion", "Gentle page and progress movement"],
              ] as const
            ).map(([key, title, detail]) => (
              <div key={key} className="flex items-center justify-between py-4">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                    {key === "sound" ? (
                      state.settings.sound ? (
                        <Volume2 size={17} />
                      ) : (
                        <VolumeX size={17} />
                      )
                    ) : (
                      <Sparkles size={17} />
                    )}
                  </span>
                  <span>
                    <strong className="block text-sm">{title}</strong>
                    <small className="text-xs text-muted-foreground">
                      {detail}
                    </small>
                  </span>
                </span>
                <button
                  onClick={() => toggle(key)}
                  type="button"
                  aria-label={`${title}: ${state.settings[key] ? "on" : "off"}`}
                  aria-pressed={state.settings[key]}
                  className={cx(
                    "focus-ring h-7 w-12 rounded-full p-1",
                    state.settings[key] ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cx(
                      "block h-5 w-5 rounded-full bg-card",
                      state.settings[key] && "translate-x-5",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="display text-lg font-bold">Learning preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">Adjust how much guidance you want while you learn.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-bold" htmlFor="difficulty">Preferred difficulty</label>
              <select id="difficulty" value={state.settings.difficulty} onChange={(event) => update({ difficulty: event.target.value as typeof state.settings.difficulty })} className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm">
                <option value="gentle">Gentle start</option><option value="standard">Standard practice</option><option value="stretch">Stretch me</option>
              </select>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span><strong className="block text-sm">Show transliteration</strong><small className="text-xs text-muted-foreground">Keep pronunciation help visible on vocabulary cards.</small></span>
              <button type="button" aria-label={`Transliteration: ${state.settings.showTransliteration ? "on" : "off"}`} aria-pressed={state.settings.showTransliteration} onClick={() => update({ showTransliteration: !state.settings.showTransliteration })} className={cx("focus-ring h-7 w-12 rounded-full p-1", state.settings.showTransliteration ? "bg-primary" : "bg-muted")}><span className={cx("block h-5 w-5 rounded-full bg-card", state.settings.showTransliteration && "translate-x-5")} /></button>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="display text-lg font-bold">Practice plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            How many minutes should your daily hello take?
          </p>
          <div className="mt-5 flex gap-2">
            {[5, 10, 15].map((minutes) => (
              <button
                key={minutes}
                onClick={() => update({ dailyGoal: minutes })}
                className={cx(
                  "focus-ring rounded-xl px-4 py-2 text-sm font-bold",
                  state.settings.dailyGoal === minutes
                    ? "bg-primary text-primary-foreground"
                    : "border border-border",
                )}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="display text-lg font-bold text-destructive">
            Start fresh
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Retake the check or clear this device's progress.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={retake}>
              Retake placement test
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all TalkDarija progress? This cannot be undone.",
                  )
                ) {
                  reset();
                  setLocation("/");
                }
              }}
            >
              Reset progress
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function AppRouter() {
  const { state } = useLocalApp();
  const [location] = useLocation();
  if (!state.profile && location !== "/") return <Onboarding />;
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/home" component={HomePage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/lesson/:lessonId" component={LessonPage} />
      <Route path="/vocabulary" component={VocabularyPage} />
      <Route path="/review" component={ReviewPage} />
      <Route path="/scenarios/:scenarioId" component={ScenarioPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route>
        <Shell>
          <div className="py-24 text-center">
            <h1 className="display text-4xl font-bold">
              That path wandered off.
            </h1>
            <Link
              href="/home"
              className="mt-5 inline-block text-sm font-bold text-primary"
            >
              Back home
            </Link>
          </div>
        </Shell>
      </Route>
    </Switch>
  );
}
export default function App() {
  return <AppRouter />;
}
