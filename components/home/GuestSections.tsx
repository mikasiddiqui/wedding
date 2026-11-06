"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { sangbleu } from "@/app/fonts"
import FloatingRSVP from "@/components/FloatingRSVP"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type GuestSectionsProps = {
  inviteId: string
  guestName?: string
  rsvpClosed: boolean
  attending: boolean
  venueAddress?: string
}

const CEREMONY_TIME = "5:00 PM"
const SEATED_BY_TIME = "4:30 PM"
const GROOM_ARRIVAL_TIME = "3:50 PM"

const schedule: { time: string; dateTime: string; title: string; detail?: string; key?: boolean }[] = [
  { time: "3:30 PM – 4:30 PM", dateTime: "15:30", title: "Pre-wedding snacks" },
  { time: GROOM_ARRIVAL_TIME, dateTime: "15:50", title: "Arrival of the groom" },
  { time: "4:00 PM", dateTime: "16:00", title: "Welcome ceremony", detail: "The ladies welcome the groom." },
  { time: "4:30 PM", dateTime: "16:30", title: "Mika enters the mandap" },
  { time: "4:40 PM", dateTime: "16:40", title: "Arrival of the bridal party" },
  { time: CEREMONY_TIME, dateTime: "17:00", title: "The wedding ceremony begins", key: true },
  { time: "6:05 PM", dateTime: "18:05", title: "Legal wedding & cake cutting" },
  { time: "7:30 PM", dateTime: "19:30", title: "Dinner" },
]

const gallery = [
  { n: 1 },
  { n: 2 },
  { n: 3, landscape: true },
  { n: 4 },
  { n: 5 },
  { n: 6, landscape: true },
  { n: 7 },
  { n: 8 },
  { n: 9 },
  { n: 10 },
  { n: 11 },
]

// One type scale for every section. Panel surfaces use `.panel` in globals.css.
const sectionHeading = `${sangbleu.className} text-[clamp(2.4rem,7vw,4.6rem)] leading-tight tracking-tight text-white`
const panelHeading = "text-[clamp(1.35rem,2.4vw,1.7rem)] leading-tight tracking-tight"
const panelBody = "text-[1rem] leading-relaxed sm:text-[1.05rem]"

const faqItems = "border-white/30"
const faqTrigger = `${sangbleu.className} text-white text-[1.05rem] sm:text-[1.2rem]`
const faqAnswer = `${sangbleu.className} text-white ${panelBody}`

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

/**
 * A full-height section whose `.reveal` children animate in once. The flag is set
 * directly on the DOM node, so scrolling never re-renders React.
 */
function Section({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!("IntersectionObserver" in window)) {
      element.dataset.inview = "true"
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.inview = "true"
          observer.disconnect()
        }
      },
      { root: element.closest("main"), threshold: 0.15 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id={id} className="relative min-h-[100dvh] snap-start">
      <div className="grid min-h-[100dvh] place-items-center pt-[96px] pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pb-[10rem] box-border">
        {children}
      </div>
    </section>
  )
}

function Photo({
  name,
  alt,
  sizes,
  landscape = false,
  loading = "lazy",
  className = "h-full w-full object-cover",
}: {
  name: string
  alt: string
  sizes: string
  landscape?: boolean
  loading?: "lazy" | "eager"
  className?: string
}) {
  const [small, large] = landscape ? [960, 1440] : [640, 960]
  return (
    <img
      src={`/images/${name}-${small}.webp`}
      srcSet={`/images/${name}-${small}.webp ${small}w, /images/${name}-${large}.webp ${large}w`}
      sizes={sizes}
      width={landscape ? 1440 : 960}
      height={landscape ? 960 : 1440}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  )
}

function MapsLink({ address }: { address: string }) {
  return (
    <a
      href={mapsUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      Open in Maps
      <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
}

function ScheduleSection({
  attending,
  rsvpClosed,
  venueAddress,
}: Pick<GuestSectionsProps, "attending" | "rsvpClosed" | "venueAddress">) {
  return (
    <Section id="schedule">
      <div className={`${sangbleu.className} w-full max-w-[min(92vw,84rem)] md:px-4`}>
        <h2 className={`reveal ${sectionHeading} text-center lg:text-left`}>
          Wedding Schedule
        </h2>
        <p className="reveal [--delay:40ms] mt-1 text-center text-[clamp(1rem,2vw,1.3rem)] text-white lg:text-left">
          Saturday, 9 January 2027
        </p>

        <div className="mt-6 grid gap-4 md:mt-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-6 min-[87.5rem]:grid-cols-[minmax(0,0.68fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="reveal [--delay:80ms] relative hidden overflow-hidden rounded-[24px] min-[87.5rem]:block">
            <Photo
              name="schedule"
              alt="Mika and Darshika walking together"
              sizes="22vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="reveal panel [--delay:80ms] px-5 py-5 sm:px-8 sm:py-7">
            <ol>
              {schedule.map((event) => (
                <li
                  key={event.dateTime}
                  className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-x-4"
                >
                  <time
                    dateTime={`2027-01-09T${event.dateTime}:00+13:00`}
                    className="py-2 text-[0.92rem] leading-snug tabular-nums sm:text-[1.02rem]"
                  >
                    {event.time}
                  </time>
                  <div className="relative border-l border-white/40 py-2 pl-4 before:absolute before:-left-[3.5px] before:top-[0.95rem] before:size-1.5 before:rounded-full before:bg-white">
                    <div
                      className={`text-[1rem] leading-snug sm:text-[1.1rem] ${event.key ? "font-bold" : ""}`}
                    >
                      {event.title}
                    </div>
                    {event.detail ? (
                      <div className="mt-0.5 text-[0.88rem] leading-snug sm:text-[0.95rem]">
                        {event.detail}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal panel [--delay:140ms] px-5 py-5 sm:px-8 sm:py-7">
            <h3 className={panelHeading}>Notes</h3>
            <div className={`mt-3 space-y-3 ${panelBody}`}>
              <p>
                Please arrive and be seated by latest{" "}
                <strong className="whitespace-nowrap font-bold tabular-nums">{SEATED_BY_TIME}</strong> for the
                ceremony to begin.
              </p>
              <p>
                If you are from the groom side, we kindly ask that you only enter the property
                once Mika has arrived at{" "}
                <strong className="whitespace-nowrap font-bold tabular-nums">{GROOM_ARRIVAL_TIME}</strong>. We
                look forward to seeing you.
              </p>
            </div>

            <div className="mt-5 border-t border-white/30 pt-4">
              <h3 className={panelHeading}>Address</h3>
              {venueAddress ? (
                <div className={`mt-2 ${panelBody}`}>
                  <p>Narayan Residence</p>
                  <p>{venueAddress}</p>
                  <MapsLink address={venueAddress} />
                </div>
              ) : (
                <p className={`mt-2 ${panelBody}`}>
                  {attending
                    ? "We will post the address here closer to the wedding date."
                    : rsvpClosed
                      ? "The address is shared here with guests who are coming."
                      : "The address appears here once you have RSVP’d yes."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function GalleryCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const [nearby, setNearby] = useState(() => !("IntersectionObserver" in window))

  // Fetch every slide before the guest gets here, so swiping never shows a blank slide.
  useEffect(() => {
    const element = ref.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true)
          observer.disconnect()
        }
      },
      { root: element.closest("main"), rootMargin: "100% 0px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <Carousel className="w-full" opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {gallery.map(({ n, landscape }) => (
            <CarouselItem key={n} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="panel h-[50vh] max-h-[560px] w-full overflow-hidden">
                <Photo
                  name={`gallery/${n}`}
                  alt={`Gallery photo ${n}`}
                  landscape={landscape}
                  loading={nearby ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 88vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-white/30 bg-[#693943]/70 text-white hover:bg-[#693943] hover:text-white" />
        <CarouselNext className="border-white/30 bg-[#693943]/70 text-white hover:bg-[#693943] hover:text-white" />
      </Carousel>
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
    <>
      {/* INVITATION */}
      <Section id="invitation">
        <div className="w-full max-w-[min(92vw,84rem)] px-4">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div className="reveal hidden md:block mx-auto w-full md:max-w-[24rem] lg:max-w-[28rem]">
              <div className="aspect-[4/5] overflow-hidden rounded-[24px]">
                <Photo
                  name="welcome"
                  alt="Mika and Darshika together"
                  sizes="(min-width: 1024px) 448px, 384px"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center text-center md:items-start md:text-left md:-mt-2 md:min-h-[26rem]">
              <div className="reveal [--delay:60ms] text-[clamp(2.4rem,8vw,4.4rem)] tracking-tight text-white pb-6 sm:pb-8 leading-none">
                {guestName ? `Hi ${guestName}!` : "Hi there!"}
              </div>
              <div className="w-full max-w-[min(92vw,72rem)] px-2 md:px-0 flex-1 flex">
                <div className="reveal panel [--delay:120ms] w-full px-5 py-5 sm:px-8 sm:py-7">
                  <div className={`${sangbleu.className} mx-auto max-w-[70ch] ${panelBody}`}>
                    <div>Uday &amp; Sashi Narayan and Sophia Sangsongkhram</div>
                    <div className="mt-2">joyfully invite you to celebrate the wedding of</div>
                    <div className="mt-2">Mika &amp; Darshika</div>
                  </div>
                  <div
                    className={`${sangbleu.className} mt-5 border-t border-white/30 pt-4 ${panelBody}`}
                  >
                    <h3 className={panelHeading}>Details</h3>
                    <div className="mt-3">Wedding date: 9 January 2027</div>
                    <div className="mt-2">
                      {venueAddress
                        ? `Residence: Narayan Residence, ${venueAddress}`
                        : "Residence: Narayan Residence, Glen Innes, Auckland, New Zealand"}
                    </div>
                    <div className="mt-4">
                      Kindly RSVP by{" "}
                      <span className={`${sangbleu.className} font-bold`}>31 March 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <ScheduleSection attending={attending} rsvpClosed={rsvpClosed} venueAddress={venueAddress} />

      {/* FAQ */}
      <Section id="faq">
        <div className="w-full max-w-[min(92vw,84rem)] px-4">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div className="reveal [--delay:60ms] hidden md:block mx-auto w-full md:max-w-[24rem] lg:max-w-[28rem]">
              <div className="aspect-[4/5] overflow-hidden rounded-[24px]">
                <Photo
                  name="faq"
                  alt="Mika and Darshika portrait"
                  sizes="(min-width: 1024px) 448px, 384px"
                />
              </div>
            </div>
            <div>
              <h2 className={`reveal ${sectionHeading} text-center md:text-left`}>
                FAQ
              </h2>
              <div className="reveal panel [--delay:100ms] mt-4 px-5 py-2 sm:mt-6 sm:px-8 sm:py-3">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-2" className={faqItems}>
                    <AccordionTrigger className={faqTrigger}>
                      What is the dress code?
                    </AccordionTrigger>
                    <AccordionContent className={faqAnswer}>
                      The dress code is formal wear and we encourage you to wear your
                      traditional cultural outfits. We recommend that you do not wear
                      high heels as it will be an outdoor event.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className={faqItems}>
                    <AccordionTrigger className={faqTrigger}>
                      Is there parking available?
                    </AccordionTrigger>
                    <AccordionContent className={faqAnswer}>
                      As the wedding will be held at the Narayan family home, there will
                      only be on street parking available. We recommend you to carpool
                      with other guests where possible.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className={faqItems}>
                    <AccordionTrigger className={faqTrigger}>
                      How will you cater for my dietary requirements?
                    </AccordionTrigger>
                    <AccordionContent className={faqAnswer}>
                      All of the food served will be vegetarian. Unfortunately, we will
                      not be able to cater for specific dietary requirements or allergies
                      e.g. gluten free.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery">
        <div className="w-full max-w-[min(92vw,96rem)] px-4">
          <h2 className={`reveal ${sectionHeading} text-center`}>
            Gallery
          </h2>
          <div className="reveal [--delay:80ms] mt-8">
            <GalleryCarousel />
          </div>
        </div>
      </Section>

      {/* Rendered here so its FAQ observers find the section on mount. */}
      {rsvpClosed ? null : (
        <FloatingRSVP dialogOpen={false} inviteId={inviteId} guestName={guestName} />
      )}
    </>
  )
}
