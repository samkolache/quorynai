import { Moon, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

function Blog() {
    return (
        <section className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
            {/* ── Header ──────────────────────────────── */}
            <header className="flex flex-col items-center gap-6 text-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
                    <Moon className="size-3.5" /> Our story
                </span>

                <h1 className="text-glow text-4xl font-light leading-[1.15] md:text-6xl">
                    Why we built Quoryn: <br />
                    <span className="text-accent">a reading that knows you</span>
                </h1>

                <p className="font-heading text-lg italic text-foreground/60">
                    From the founders of Quoryn · October 2026
                </p>
            </header>

            <div className="mx-auto my-12 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            {/* ── Story ───────────────────────────────── */}
            <article className="flex flex-col gap-6 text-lg leading-relaxed text-foreground/85">
                <p>
                    It started on a night like many others. One of us couldn't sleep, worried
                    about a decision that felt too big to make alone. So we did what millions of
                    people do: we opened an astrology app, hoping for a little clarity.
                </p>
                <p>
                    What we got was a paragraph that could have been written for anyone.{" "}
                    <em>"Today brings new opportunities. Be open to change."</em> It was kind,
                    but it was empty. It didn't know our story, our chart, or the question we
                    were really carrying.
                </p>
                <p>
                    So we tried another app. And another. We read horoscopes, pulled digital
                    tarot cards, and filled out birth chart forms on website after website. Each
                    time, the answers were the same: vague, general, and quietly disappointing.
                    The stars were supposed to be personal. Somehow, the tools built around them
                    had forgotten that.
                </p>

                <h2 className="text-glow mt-6 text-3xl font-light md:text-4xl">
                    What spirituality really gives people
                </h2>
                <p>
                    As we talked with friends, family, and strangers, we kept hearing the same
                    thing. People don't turn to astrology, tarot, or intuition because they want
                    to be entertained. They turn to it when they are standing at a crossroads.
                    After a breakup. Before a move. In the middle of a sleepless night, when the
                    world feels loud and their own voice feels quiet.
                </p>
                <p>
                    In those moments, a meaningful reading can be a lantern. It can help someone
                    slow down, see their situation from a new angle, and remember that they are
                    part of something larger. We saw how deeply this practice shapes the way
                    people heal, choose, and grow. And we saw how rarely they had access to it
                    when they needed it most.
                </p>

                <blockquote className="my-6 border-l-2 border-primary/60 pl-6 font-heading text-2xl italic leading-snug text-accent md:text-3xl">
                    Guidance shouldn't wait for an appointment. It should meet you exactly
                    where you are.
                </blockquote>

                <p>
                    A good reader can change someone's week, sometimes their year. But good
                    readers are hard to find, often expensive, and almost never available at two
                    in the morning. We believed everyone deserved a place to find answers in the
                    moments that matter, without a waiting room and without a script.
                </p>

                <h2 className="text-glow mt-6 text-3xl font-light md:text-4xl">
                    Building something that truly listens
                </h2>
                <p>
                    So we set out to build it ourselves. We spent long nights studying
                    traditional astrology, the symbolism of tarot, the practice of
                    manifestation, and the language of intuition. We learned from practitioners
                    who have spent decades reading for others, and we asked them what separates
                    a real reading from a generic one.
                </p>
                <p>
                    Their answer was always the same: <em>attention</em>. A true reading
                    considers your full birth chart, not just your sun sign. It remembers what
                    you shared last time. It understands the question beneath your question.
                </p>
                <p>
                    That became our standard. We worked to make Quoryn accurate in the details,
                    from planetary positions to the meaning of every card, and thoughtful in the
                    way it responds. Every reading is shaped by your sky, your story, and what
                    you are facing right now. Not a template. Not a guess. A conversation that
                    grows to understand you more deeply each time you return.
                </p>

                <h2 className="text-glow mt-6 text-3xl font-light md:text-4xl">
                    Where we are going
                </h2>
                <p>
                    Quoryn is our answer to that sleepless night. It is the guide we wished we
                    had: one that is always there, that knows who you are, and that speaks to
                    you with care and honesty.
                </p>
                <p>
                    We are just getting started, and we are so grateful you are here. Whether
                    you come to Quoryn with a big question or simply a quiet curiosity, we hope
                    you leave feeling a little more seen, a little more certain, and a little
                    more connected to the sky above you.
                </p>
                <p className="font-heading text-xl italic text-foreground/70">
                    With light,
                    <br />
                    The Quoryn team
                </p>
            </article>

            {/* ── Call to action ──────────────────────── */}
            <div className="mt-16 flex flex-col items-center gap-5 rounded-2xl border border-primary/25 bg-secondary/40 px-6 py-10 text-center backdrop-blur-sm">
                <Sparkles className="size-6 text-accent" />
                <p className="font-heading text-2xl font-light md:text-3xl">
                    Ready for a reading that's truly yours?
                </p>
                <Button
                    render={<Link to="/onboarding" />}
                    nativeButton={false}
                    className="bg-primary h-auto px-7 py-3.5 text-base animate-pulse-glow"
                >
                    Begin your free reading
                </Button>
            </div>
        </section>
    )
}

export default Blog
