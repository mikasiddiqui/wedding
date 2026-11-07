"use client"

import { ArrowUpRight } from "lucide-react"
import { sangbleu } from "@/app/fonts"
import RsvpDialog from "@/components/RsvpDialog"
import FaqAccordion from "@/components/ui/faq-accordion"
import FilmStrip from "./FilmStrip"
import InView from "./InView"
import Reveal from "./Reveal"
import ScheduleList from "./ScheduleList"

type GuestSectionsProps = {
  inviteId: string
  guestName?: string
  rsvpClosed: boolean
  attending: boolean
  venueAddress?: string
}

const SEATED_BY_TIME = "4:30 PM"
const GROOM_ARRIVAL_TIME = "3:50 PM"

const faqs = [
  {
    question: "What is the dress code?",
    answer:
      "The dress code is formal wear and we encourage you to wear your traditional cultural outfits. We recommend that you do not wear high heels as it will be an outdoor event.",
  },
  {
    question: "Is there parking available?",
    answer:
      "As the wedding will be held at the Narayan family home, there will only be on street parking available. We recommend you to carpool with other guests where possible.",
  },
  {
    question: "How will you cater for my dietary requirements?",
    answer:
      "All of the food served will be vegetarian. Unfortunately, we will not be able to cater for specific dietary requirements or allergies e.g. gluten free.",
  },
]

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

function FanPhoto({ name, alt, position }: { name: string; alt: string; position: "left" | "centre" | "right" }) {
  return (
    <div className={`fan-photo fan-${position}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${name}-640.webp`}
        srcSet={`/images/${name}-640.webp 640w, /images/${name}-960.webp 960w`}
        sizes="(min-width: 768px) 340px, 50vw"
        width={960}
        height={1440}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default function GuestSections({
  inviteId,
  guestName,
  rsvpClosed,
  attending,
  venueAddress,
}: GuestSectionsProps) {
  return (
    <div className={`${sangbleu.className} guest animate-in fade-in duration-1000`}>
      {/* WHEN / WHERE / RSVP strip that closes the first screen */}
      <dl className="facts">
        <div>
          <dt>When</dt>
          <dd>Saturday, 9 January 2027</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{venueAddress ? `Narayan Residence, ${venueAddress}` : "Narayan Residence, Glen Innes, Auckland, New Zealand"}</dd>
        </div>
        <div>
          <dt>RSVP</dt>
          <dd>
            Kindly RSVP by <span className="font-bold">31 March 2026</span>
          </dd>
        </div>
      </dl>

      {/* INVITATION */}
      <section id="invitation" className="block-section">
        <InView className="stanza">
          <p className="r-line greeting" style={{ "--i": 0 } as React.CSSProperties}>
            {guestName ? `Hi ${guestName}!` : "Hi there!"}
          </p>
          <p className="r-line stanza-hosts" style={{ "--i": 1 } as React.CSSProperties}>
            Uday &amp; Sashi Narayan
            <br />
            and Sophia Sangsongkhram
          </p>
          <p className="r-line stanza-invite" style={{ "--i": 2 } as React.CSSProperties}>
            joyfully invite you to celebrate the wedding of
          </p>
          <p className="r-line stanza-names" style={{ "--i": 3 } as React.CSSProperties}>
            Mika <span className="stanza-and">&amp;</span> Darshika
          </p>
        </InView>
        <InView className="fan">
          <FanPhoto name="schedule" alt="Mika and Darshika walking together" position="left" />
          <FanPhoto name="faq" alt="Mika and Darshika portrait" position="right" />
          <FanPhoto name="welcome" alt="Mika and Darshika together" position="centre" />
        </InView>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="block-section">
        <div className="section-head">
          <Reveal as="h2" className="section-title" parts={[{ text: "Wedding" }, { text: "schedule", accent: true }]} />
          <p className="section-note">Saturday, 9 January 2027</p>
        </div>

        <ScheduleList />

        <div className="notes">
          <InView className="fade-up">
            <h3 className="notes-title">Notes</h3>
            <div className="mt-5 space-y-5">
              <p>
                Please arrive and be seated by latest{" "}
                <strong className="whitespace-nowrap font-bold">{SEATED_BY_TIME}</strong> for the ceremony to begin.
              </p>
              <p>
                If you are from the groom side, we kindly ask that you only enter the property once Mika has arrived
                at <strong className="whitespace-nowrap font-bold">{GROOM_ARRIVAL_TIME}</strong>. We look forward to
                seeing you.
              </p>
            </div>
          </InView>
          <InView className="fade-up">
            <h3 className="notes-title">Address</h3>
            {venueAddress ? (
              <div className="mt-5">
                <p>Narayan Residence</p>
                <p>{venueAddress}</p>
                <a href={mapsUrl(venueAddress)} target="_blank" rel="noopener noreferrer" className="pill mt-5">
                  Open in Maps
                  <ArrowUpRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
                </a>
              </div>
            ) : (
              <p className="mt-5">
                {attending
                  ? "We will post the address here closer to the wedding date."
                  : rsvpClosed
                    ? "The address is shared here with guests who are coming."
                    : "The address appears here once you have RSVP’d yes."}
              </p>
            )}
          </InView>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="block-section">
        <Reveal as="h2" by="letter" className="love-title" parts={[{ text: "FAQ" }]} />
        <InView className="fade-up faq-list">
          <FaqAccordion items={faqs} />
        </InView>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery-section">
        <Reveal as="h2" by="letter" className="love-title" parts={[{ text: "Gallery" }]} />
        <FilmStrip />
      </section>

      {/* CLOSE */}
      <section className="block-section close">
        {rsvpClosed ? null : (
          <div className="close-rsvp">
            <RsvpDialog inviteId={inviteId} guestName={guestName} triggerClassName="pill pill-lg" triggerLabel="RSVP" />
          </div>
        )}
        <Reveal
          as="p"
          className="closing-line"
          parts={[{ text: "We can’t wait to" }, { text: "celebrate", accent: true }, { text: "with you." }]}
        />
      </section>

      <footer className="site-foot">
        <span className="font-love text-[1.5rem] leading-none">M&amp;D</span>
        <span>Mika &amp; Darshika</span>
        <span>9 January 2027</span>
      </footer>
    </div>
  )
}
