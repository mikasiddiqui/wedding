export default function Home() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center px-6">
      <div className="relative w-full max-w-[92vw] text-center">
        <div
          className="
            relative z-10
            text-[clamp(5.6rem,17vw,10.5rem)]
            tracking-tight
            translate-x-[-0.75rem]
          "
        >
          Mika
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="
              leading-none opacity-60
              text-[clamp(7.4rem,20vw,15rem)]
            "
          >
            &
          </span>
        </div>

        <div
          className="
            relative z-10 mt-[-1.6rem]
            text-[clamp(5.6rem,17vw,10.5rem)]
            tracking-tight
            translate-x-[0.75rem]
          "
        >
          Darshika
        </div>

      </div>
    </main>
  )
}
