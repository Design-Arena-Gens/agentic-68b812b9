"use client";

import { useEffect, useMemo, useState } from "react";

type ScheduleBlock = {
  label: string;
  start: string;
  end?: string;
  summary: string;
  details: string[];
};

const SCHEDULE: ScheduleBlock[] = [
  {
    label: "ঘুম থেকে ওঠা",
    start: "07:00 AM",
    end: "07:20 AM",
    summary: "পানি পান, ফ্রেশ হওয়া",
    details: ["এক গ্লাস পানি পান", "মুখ-হাত ধোয়া", "দ্রুত স্ট্রেচিং"],
  },
  {
    label: "সকাল রুটিন",
    start: "07:20 AM",
    end: "08:00 AM",
    summary: "সকালের নাস্তা + হেয়ার কেয়ার",
    details: ["সুষম নাস্তা", "স্কিন ও হেয়ার কেয়ার রুটিন", "দিনের লক্ষ্য নির্ধারণ"],
  },
  {
    label: "শেখা",
    start: "08:00 AM",
    end: "10:00 AM",
    summary: "ডিজিটাল দক্ষতা বৃদ্ধি",
    details: ["SEO রিসার্চ", "স্টোরিটেলিং অনুশীলন", "সোশ্যাল মিডিয়া ম্যানেজমেন্ট"],
  },
  {
    label: "বিরতি",
    start: "10:00 AM",
    end: "10:30 AM",
    summary: "বিশ্রাম, চা বা পানি পান",
    details: ["চা/লেবু পানি", "শ্বাস-প্রশ্বাস ব্যায়াম", "মন ফ্রেশ রাখা"],
  },
  {
    label: "কনটেন্ট কাজ",
    start: "10:30 AM",
    end: "12:30 PM",
    summary: "রিসার্চ ও স্ক্রিপ্ট রাইটিং",
    details: ["টপিক ফাইনালাইজ", "স্ক্রিপ্ট চেকলিস্ট", "B-roll আইডিয়া সংগ্রহ"],
  },
  {
    label: "লাঞ্চ ও বিশ্রাম",
    start: "12:30 PM",
    end: "01:30 PM",
    summary: "লাঞ্চ ও ৩০ মিনিট দুপুরের ঘুম",
    details: ["সুষম লাঞ্চ", "হালকা হাঁটা", "পাওয়ার ন্যাপ (৩০ মিনিট)"],
  },
  {
    label: "ব্যায়াম",
    start: "01:30 PM",
    end: "02:30 PM",
    summary: "কার্ডিও, স্ট্রেচিং, ওয়ার্কআউট",
    details: ["HIIT বা কার্ডিও", "ফুল-বডি স্ট্রেচ", "কুলডাউন মেডিটেশন"],
  },
  {
    label: "কনটেন্ট ক্রিয়েশন",
    start: "02:30 PM",
    end: "06:30 PM",
    summary: "ভিডিও এডিটিং, থাম্বনেইল, আপলোড প্রস্তুতি",
    details: ["র' ফুটেজ ইম্পোর্ট", "এডিটিং ও কালার গ্রেড", "থাম্বনেইল ডিজাইন", "আপলোড শিডিউল"],
  },
  {
    label: "প্রস্তুতি",
    start: "06:30 PM",
    end: "07:00 PM",
    summary: "হালকা খাবার, লাইভ সেটআপ রেডি",
    details: ["স্ন্যাকস", "লাইভ গিয়ার চেক", "নেটওয়ার্ক চেক"],
  },
  {
    label: "লাইভ স্ট্রিম",
    start: "07:00 PM",
    end: "10:00 PM",
    summary: "YouTube বা Rooter.io তে লাইভ",
    details: ["ইন্টার‍্যাকটিভ লাইভ", "চ্যাট এঙ্গেজমেন্ট", "CTA রিমাইন্ডার"],
  },
  {
    label: "পোস্ট-স্ট্রিম কাজ",
    start: "10:00 PM",
    end: "10:30 PM",
    summary: "ফিডব্যাক দেখা, মন্তব্যের উত্তর",
    details: ["ভিউ ও চ্যাট এনালাইসিস", "কমেন্ট রিপ্লাই", "পরের দিনের নোট"],
  },
  {
    label: "রিল্যাক্স টাইম",
    start: "10:30 PM",
    end: "11:30 PM",
    summary: "মুভি, মিউজিক, নিজস্ব সময়",
    details: ["হালকা মুভি/সিরিজ", "মিউজিক প্লেলিস্ট", "জার্নালিং"],
  },
  {
    label: "ঘুম",
    start: "11:30 PM",
    summary: "পরের দিনের প্রস্তুতি",
    details: ["রুম প্রস্তুত", "অ্যালার্ম সেট", "ডিজিটাল ডিটক্স"],
  },
];

const DAY_START_MINUTES = toMinutes(SCHEDULE[0].start);
const DAY_END_MINUTES = toMinutes(SCHEDULE[SCHEDULE.length - 1].end ?? "11:59 PM");

function toMinutes(time: string) {
  const [raw, modifier] = time.split(" ");
  const [hourStr, minuteStr] = raw.split(":");
  let hours = Number(hourStr);
  const minutes = Number(minuteStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error(`Invalid time string "${time}"`);
  }
  const normalizedModifier = modifier?.toUpperCase();
  if (normalizedModifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (normalizedModifier === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

function humanizeDuration(minutes: number) {
  if (minutes <= 0) return "সমাপ্ত";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} মিনিট বাকি`;
  }
  if (mins === 0) {
    return `${hours} ঘণ্টা বাকি`;
  }
  return `${hours} ঘন্টা ${mins} মিনিট বাকি`;
}

export default function Home() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const currentMinutes = useMemo(() => now.getHours() * 60 + now.getMinutes(), [now]);

  const parsed = useMemo(
    () =>
      SCHEDULE.map((block, index) => {
        const startMinutes = toMinutes(block.start);
        const endMinutes = block.end ? toMinutes(block.end) : undefined;
        const normalizedEnd =
          endMinutes ??
          (index < SCHEDULE.length - 1 ? toMinutes(SCHEDULE[index + 1].start) : startMinutes + 60);
        return { block, startMinutes, endMinutes: normalizedEnd };
      }),
    []
  );

  const activeBlock = parsed.find(
    ({ startMinutes, endMinutes }) =>
      currentMinutes >= startMinutes && currentMinutes < endMinutes
  );

  const dayProgress = useMemo(() => {
    if (currentMinutes <= DAY_START_MINUTES) return 0;
    if (currentMinutes >= DAY_END_MINUTES) return 100;
    return ((currentMinutes - DAY_START_MINUTES) / (DAY_END_MINUTES - DAY_START_MINUTES)) * 100;
  }, [currentMinutes]);

  return (
    <div className="bg-slate-950 text-slate-100">
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-8 lg:px-12">
        <header className="mb-12 space-y-4 rounded-3xl bg-slate-900 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Creator Daily Ops
              </p>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                দিনব্যাপী প্রোডাক্টিভ কন্টেন্ট ক্রিয়েটর প্ল্যানার
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-300 sm:text-lg">
                স্ট্রিমিং, শেখা, এবং কনটেন্ট তৈরির ব্যস্ত সময়সূচিকে স্মার্টভাবে ম্যানেজ করার জন্য
                লাইভ ড্যাশবোর্ড। বর্তমান কাজ, আসন্ন ফোকাস, আর বিরতির সময় এক জায়গায়।
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6 text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">বর্তমান সময়</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {now.toLocaleTimeString("bn-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p className="text-sm text-slate-400">
                {now.toLocaleDateString("bn-BD", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>দিনের অগ্রগতি</span>
              <span>{dayProgress.toFixed(0)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {parsed.map(({ block, startMinutes, endMinutes }) => {
              const isActive = activeBlock?.block.label === block.label;
              const isPast = currentMinutes > endMinutes;
              const minutesRemaining = endMinutes - currentMinutes;
              return (
                <article
                  key={block.label}
                  className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 ${
                    isActive
                      ? "ring-2 ring-cyan-400/80"
                      : isPast
                        ? "opacity-60 grayscale"
                        : "hover:border-cyan-500/40 hover:bg-slate-900"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">সময়</p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {block.start} {block.end ? `– ${block.end}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ফোকাস</p>
                      <h2 className="mt-1 text-2xl font-bold text-white">{block.label}</h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-300 sm:text-base">{block.summary}</p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {block.details.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                    <span>
                      {isActive
                        ? humanizeDuration(minutesRemaining)
                        : isPast
                          ? "সম্পন্ন"
                          : `${humanizeDuration(startMinutes - currentMinutes)}`}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-2 text-cyan-200">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                        চলমান
                      </span>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">পরের প্রস্তুতি</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {activeBlock
                  ? parsed.find((entry) => entry.startMinutes === activeBlock.endMinutes)?.block
                      .label ?? "দিনের শেষ"
                  : currentMinutes < parsed[0].startMinutes
                    ? parsed[0].block.label
                    : "দিনের শেষ"}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {(activeBlock
                  ? parsed.find((entry) => entry.startMinutes === activeBlock.endMinutes)?.block
                      .details
                  : currentMinutes < parsed[0].startMinutes
                    ? parsed[0].block.details
                    : undefined
                )?.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </li>
                )) ?? (
                  <li className="text-slate-500">আজকের সব কাজ সম্পন্ন 🎉</li>
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900 to-blue-950/90 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Focus Hacks</p>
              <h3 className="mt-2 text-xl font-semibold text-white">প্রতিদিন ধারাবাহিকতা রাখুন</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-200">
                <li>
                  <strong className="text-cyan-200">ডিপ ওয়ার্ক ব্লক:</strong> শেখা ও কনটেন্ট কাজের
                  ব্লকে নোটিফিকেশন সাইলেন্ট রাখুন।
                </li>
                <li>
                  <strong className="text-cyan-200">বিরতি মানে বিরতি:</strong> ৩০ মিনিটের বিরতি
                  সত্যিকারের রিচার্জের জন্য ব্যবহার করুন।
                </li>
                <li>
                  <strong className="text-cyan-200">লাইভ চেকলিস্ট:</strong> স্ট্রিমের আগে অডিও,
                  ভিজ্যুয়াল, এবং নেটওয়ার্ক ডাবল চেক করুন।
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                দৈনিক রেট্রো প্রশ্ন
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>✅ আজকের স্ট্রিম থেকে কী শিখলাম?</li>
                <li>🎯 কালকের ভিডিওর জন্য প্রধান ফোকাস কী?</li>
                <li>🧘‍♀️ নিজেকে কিভাবে আরও এনার্জেটিক রাখব?</li>
              </ul>
            </div>
          </aside>
        </section>

        <footer className="mt-16 rounded-3xl border border-slate-900 bg-slate-950/80 p-6 text-center text-sm text-slate-500">
          আগামী দিনের প্রস্তুতির জন্য রাত্রে ১১:০০টার মধ্যে ডিভাইস অফ করে দিন ও নিজেকে রিচার্জ করুন।
        </footer>
      </main>
    </div>
  );
}
