"use client"

import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { sangbleu } from "./fonts"
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

function useInViewOnce(
  targetRef: RefObject<HTMLElement | null>,
  rootRef: RefObject<HTMLElement | null>,
  threshold = 0.6,
  defaultInView = false
) {
  const [inView, setInView] = useState(defaultInView)

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true)
      return
    }

    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        root: rootRef.current ?? null,
        threshold,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef, rootRef, threshold])

  return inView
}

export default function Home() {
  const [guestName, setGuestName] = useState<string | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const inviteRef = useRef<HTMLDivElement | null>(null)
  const scheduleRef = useRef<HTMLDivElement | null>(null)
  const faqRef = useRef<HTMLDivElement | null>(null)
  const galleryRef = useRef<HTMLDivElement | null>(null)

  const heroInView = useInViewOnce(heroRef, mainRef, 0.6)
  const inviteInView = useInViewOnce(inviteRef, mainRef, 0.6)
  const scheduleInView = useInViewOnce(scheduleRef, mainRef, 0.6)
  const faqInView = useInViewOnce(faqRef, mainRef, 0.6)
  const galleryInView = useInViewOnce(galleryRef, mainRef, 0.6)

  const galleryImages = Array.from({ length: 11 }, (_, index) => {
    return `/images/gallery/${index + 1}.jpg`
  })

  const revealBase =
    "transition-[opacity,transform] duration-[1760ms] ease-out will-change-transform"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const inviteId = params.get("invite")

    if (!inviteId) return

    const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
    if (!apiUrl) return

    const controller = new AbortController()

    const loadGuestName = async () => {
      try {
        const response = await fetch(
          `${apiUrl}?inviteId=${encodeURIComponent(inviteId)}`,
          { signal: controller.signal }
        )
        if (!response.ok) return
        const data = await response.json()
        const title = typeof data?.title === "string" ? data.title : ""
        setGuestName(title ? title : null)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setGuestName(null)
        }
      }
    }

    loadGuestName()
    return () => controller.abort()
  }, [])

  return (
    <main
      ref={mainRef}
      className="relative h-[100dvh] overflow-y-auto snap-y snap-mandatory px-6"
    >

      {/* HERO (unchanged) */}
      <div
        ref={heroRef}
        className="relative h-[100dvh] snap-start [scroll-snap-stop:always]"
      >
        <div className="grid h-full place-items-center pt-[96px] pb-[calc(12vh+env(safe-area-inset-bottom))] sm:pb-[10vh] md:pb-[12rem] box-border">
          <div className="relative w-full max-w-[92vw] text-center">

          {/* Date */}
          <div
            className={`
              mb-6
              text-[clamp(2.2rem,5vw,4rem)]
              tracking-[0.28em]
              uppercase
              text-white
              [text-rendering:optimizeLegibility]
              [-webkit-text-stroke:0.3px_rgba(255,255,255,0.9)]
              ${revealBase} ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[320ms]
            `}
          >
            January 9th 2027
          </div>

          {/* Mika */}
          <div
            className={`
              relative z-10
              text-[clamp(4.4rem,15vw,10.5rem)]
              sm:text-[clamp(5.6rem,17vw,10.5rem)]
              tracking-tight
              translate-x-0
              sm:translate-x-[-0.75rem]
              ${revealBase} ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} delay-[640ms]
            `}
          >
            Mika
          </div>

          {/* Ampersand */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className={`
                relative
                top-[3rem]
                leading-none
                text-[clamp(7.4rem,20vw,15rem)]
                ${revealBase} ${heroInView ? "opacity-60 translate-y-0" : "opacity-0 translate-y-4"} delay-[960ms]
              `}
            >
              &
            </span>
          </div>

          {/* Darshika */}
          <div
            className={`
              relative z-10 mt-[-1rem]
              sm:mt-[-1.6rem]
              text-[clamp(4.4rem,15vw,10.5rem)]
              sm:text-[clamp(5.6rem,17vw,10.5rem)]
              tracking-tight
              translate-x-0
              sm:translate-x-[0.75rem]
              ${revealBase} ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} delay-[1280ms]
            `}
          >
            Darshika
          </div>

          </div>
        </div>
      </div>

      {/* NEXT CONTENT */}
      <div
        ref={inviteRef}
        id="invitation"
        className="relative h-[100dvh] snap-start [scroll-snap-stop:always] [content-visibility:auto] [contain-intrinsic-size:100dvh]"
      >
        <div className="grid h-full place-items-center pt-[96px] pb-[14rem] md:pb-[12rem] box-border">
          <div className="w-full max-w-[min(92vw,84rem)] px-4">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div
                className={`
                  ${revealBase} ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[320ms]
                  hidden md:block
                  mx-auto w-full md:max-w-[24rem] lg:max-w-[28rem]
                `}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[20px]">
                  <img
                    src="/images/welcome.jpg"
                    alt="Mika and Darshika together"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center text-center md:items-start md:text-left md:-mt-2 md:min-h-[26rem]">
                <div
                  className={`
                    text-[clamp(2.4rem,8vw,4.4rem)]
                    tracking-tight
                    text-white
                    pb-6 sm:pb-8
                    leading-none
                    ${revealBase} ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[640ms]
                  `}
                >
                  {guestName ? `Hi ${guestName}!` : "Hi there!"}
                </div>
                <div className="w-full max-w-[min(92vw,72rem)] px-2 md:px-0 flex-1 flex">
                  <div
                    className={`
                      rounded-[28px]
                      border border-white/60
                      bg-white/5
                      px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10
                      backdrop-blur-[2px]
                      ${revealBase} ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[960ms]
                    `}
                  >
                    <div
                      className={`
                        ${sangbleu.className}
                        mx-auto max-w-[70ch]
                        text-[clamp(0.95rem,2.3vw,1.6rem)]
                        font-normal
                        leading-snug sm:leading-relaxed
                        text-white/95
                        ${revealBase} ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} delay-[1280ms]
                      `}
                    >
                      <div className="text-[clamp(0.95rem,2.2vw,1.4rem)] text-white/95">
                        Uday &amp; Sashi Narayan and Sophia Sangsongkhram
                      </div>
                      <div className="mt-2 sm:mt-3 text-[clamp(0.95rem,2.2vw,1.4rem)] text-white/95">
                        joyfully invite you to celebrate the wedding of
                      </div>
                      <div className="mt-2 sm:mt-3 text-[clamp(0.95rem,2.2vw,1.4rem)] text-white/95">
                        Mika &amp; Darshika
                      </div>
                    </div>
                    <div
                      className={`
                        ${sangbleu.className}
                        mt-6 sm:mt-8
                        text-[clamp(0.78rem,1.9vw,1.05rem)]
                        font-medium
                        tracking-[0.1em]
                        leading-snug sm:leading-relaxed
                        text-white/90
                        ${revealBase} ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} delay-[1600ms]
                      `}
                    >
                      <div className="text-white/85">
                        Details
                      </div>
                      <div className="mt-3">
                        Wedding date: 9 January 2027
                      </div>
                      <div className="mt-2">
                        Residence: Narayan Residence, Glen Innes, Auckland, New Zealand
                      </div>
                      <div className="mt-6 sm:mt-8">
                        Kindly RSVP by{" "}
                        <span className={`${sangbleu.className} font-bold`}>31 March 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 3 */}
      <div
        ref={scheduleRef}
        id="schedule"
        className="relative h-[100dvh] snap-start [scroll-snap-stop:always] [content-visibility:auto] [contain-intrinsic-size:100dvh]"
      >
        <div className="grid h-full place-items-center pt-[96px] pb-[calc(19rem+env(safe-area-inset-bottom))] sm:pb-[18rem] md:pb-[12rem] box-border">
          <div className="w-full max-w-[min(92vw,84rem)] px-4">
            <div
              className="
                grid gap-6 sm:gap-8
                p-2
                md:grid-cols-[1fr_1.05fr]
                md:items-center
                md:gap-10
                md:p-0
              "
            >
              <div className="text-center md:text-left">
                <div className="mx-auto max-w-[22rem] sm:max-w-[26rem] md:max-w-none">
                  <div
                    className={`
                      ${sangbleu.className}
                      text-[clamp(2rem,5.6vw,4.4rem)]
                      sm:text-[clamp(2.2rem,6vw,4.4rem)]
                      tracking-tight
                      text-white
                      ${revealBase} ${scheduleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[800ms]
                    `}
                  >
                    Schedule
                  </div>
                  <div
                    className={`
                      ${sangbleu.className}
                      mt-3 sm:mt-4
                      text-[clamp(0.98rem,2.25vw,1.6rem)]
                      sm:text-[clamp(1.05rem,2.4vw,1.6rem)]
                      leading-relaxed
                      text-white/90
                      ${revealBase} ${scheduleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[1120ms]
                    `}
                  >
                    A schedule of the day's events and rituals will be posted later this year.
                  </div>
                </div>
              </div>
              <div
                className={`
                  ${revealBase} ${scheduleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[400ms]
                  relative w-full max-w-[12.75rem] sm:max-w-[22rem] md:max-w-[430px] lg:max-w-[480px] mx-auto overflow-hidden rounded-[20px]
                `}
              >
                <div className="aspect-[4/5] md:aspect-[3/4]">
                  <img
                    src="/images/schedule.jpg"
                    alt="Mika and Darshika walking together"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div
        ref={faqRef}
        id="faq"
        className="relative h-[100dvh] snap-start [scroll-snap-stop:always] [content-visibility:auto] [contain-intrinsic-size:100dvh]"
      >
        <div className="grid h-full place-items-center pt-[96px] pb-[14rem] md:pb-[12rem] box-border">
          <div className="w-full max-w-[min(92vw,84rem)] px-4">
            <div className="mt-4 grid gap-8 sm:mt-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
              <div
                className={`
                  ${revealBase} ${faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[640ms]
                  hidden md:block
                  mx-auto w-full md:max-w-[24rem] lg:max-w-[28rem]
                `}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[20px]">
                  <img
                    src="/images/faq.jpg"
                    alt="Mika and Darshika portrait"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div>
                <div
                  className={`
                    ${revealBase} ${faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[320ms]
                    ${sangbleu.className}
                    text-center md:text-left
                    text-[clamp(2.4rem,7vw,4.6rem)]
                    tracking-tight
                    text-white
                  `}
                >
                  FAQ
                </div>
                <div
                  className={`
                    ${revealBase} ${faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[960ms]
                    mt-4 sm:mt-6
                    rounded-[24px]
                    bg-white/5
                    px-6 py-6
                    backdrop-blur-[2px]
                    md:px-8
                  `}
                >
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-white/20">
                    <AccordionTrigger
                      className={`${sangbleu.className} text-white text-[clamp(0.98rem,2.4vw,1.6rem)] sm:text-[clamp(1.1rem,2.6vw,1.6rem)]`}
                    >
                      How will I know which address to go to on the day?
                    </AccordionTrigger>
                    <AccordionContent
                      className={`${sangbleu.className} text-white/90 text-[clamp(0.9rem,2vw,1.3rem)] sm:text-[clamp(0.95rem,2.2vw,1.3rem)] leading-relaxed`}
                    >
                      For privacy reasons, we will be posting the address of the location
                      closer to the date of the wedding date.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-white/20">
                    <AccordionTrigger
                      className={`${sangbleu.className} text-white text-[clamp(0.98rem,2.4vw,1.6rem)] sm:text-[clamp(1.1rem,2.6vw,1.6rem)]`}
                    >
                      What is the dress code?
                    </AccordionTrigger>
                    <AccordionContent
                      className={`${sangbleu.className} text-white/90 text-[clamp(0.9rem,2vw,1.3rem)] sm:text-[clamp(0.95rem,2.2vw,1.3rem)] leading-relaxed`}
                    >
                      The dress code is formal wear and we encourage you to wear your
                      traditional cultural outfits. We recommend that you do not wear
                      high heels as it will be an outdoor event.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-white/20">
                    <AccordionTrigger
                      className={`${sangbleu.className} text-white text-[clamp(0.98rem,2.4vw,1.6rem)] sm:text-[clamp(1.1rem,2.6vw,1.6rem)]`}
                    >
                      Is there parking available?
                    </AccordionTrigger>
                    <AccordionContent
                      className={`${sangbleu.className} text-white/90 text-[clamp(0.9rem,2vw,1.3rem)] sm:text-[clamp(0.95rem,2.2vw,1.3rem)] leading-relaxed`}
                    >
                      As the wedding will be held at the Narayan family home, there will
                      only be on street parking available. We recommend you to carpool
                      with other guests where possible.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-white/20">
                    <AccordionTrigger
                      className={`${sangbleu.className} text-white text-[clamp(0.98rem,2.4vw,1.6rem)] sm:text-[clamp(1.1rem,2.6vw,1.6rem)]`}
                    >
                      How will you cater for my dietary requirements?
                    </AccordionTrigger>
                    <AccordionContent
                      className={`${sangbleu.className} text-white/90 text-[clamp(0.9rem,2vw,1.3rem)] sm:text-[clamp(0.95rem,2.2vw,1.3rem)] leading-relaxed`}
                    >
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
        </div>
      </div>

      {/* GALLERY */}
      <div
        ref={galleryRef}
        id="gallery"
        className="relative h-[100dvh] snap-start [scroll-snap-stop:always] [content-visibility:auto] [contain-intrinsic-size:100dvh]"
      >
        <div className="grid h-full place-items-center pt-[96px] pb-[12rem] md:pb-[10rem] box-border">
          <div className="w-full max-w-[min(92vw,96rem)] px-4">
            <div
              className={`
                ${revealBase} ${galleryInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[320ms]
                ${sangbleu.className}
                text-center
                text-[clamp(2.4rem,7vw,4.6rem)]
                tracking-tight
                text-white
              `}
            >
              Gallery
            </div>
            <div
              className={`
                ${revealBase} ${galleryInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} delay-[640ms]
                mt-8
              `}
            >
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent>
                  {galleryImages.map((src, index) => (
                    <CarouselItem
                      key={src}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="h-[50vh] max-h-[560px] w-full overflow-hidden rounded-[24px] border border-white/20 bg-white/5">
                        <img
                          src={src}
                          alt={`Gallery photo ${index + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="border-white/60 bg-white/10 text-white hover:bg-white/20" />
                <CarouselNext className="border-white/60 bg-white/10 text-white hover:bg-white/20" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
