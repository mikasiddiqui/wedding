"use client"

import InView from "./InView"

const schedule: { time: string; dateTime: string; title: string; detail?: string; key?: boolean }[] = [
  { time: "3:30 PM – 4:30 PM", dateTime: "15:30", title: "Pre-wedding snacks" },
  { time: "3:50 PM", dateTime: "15:50", title: "Arrival of the groom" },
  { time: "4:00 PM", dateTime: "16:00", title: "Welcome ceremony", detail: "The ladies welcome the groom." },
  { time: "4:30 PM", dateTime: "16:30", title: "Mika enters the mandap" },
  { time: "4:40 PM", dateTime: "16:40", title: "Arrival of the bridal party" },
  { time: "5:00 PM", dateTime: "17:00", title: "The wedding ceremony begins", key: true },
  { time: "6:05 PM", dateTime: "18:05", title: "Legal wedding & cake cutting" },
  { time: "7:30 PM", dateTime: "19:30", title: "Dinner" },
]

export default function ScheduleList() {
  return (
    <InView as="ol" className="rows">
      {schedule.map((event, index) => (
        <li key={event.dateTime} className="row" style={{ "--i": index } as React.CSSProperties}>
          <time dateTime={`2027-01-09T${event.dateTime}:00+13:00`} className="row-time">
            {event.time}
          </time>
          <div>
            <div className={`row-title ${event.key ? "row-key" : ""}`}>{event.title}</div>
            {event.detail ? <div className="row-detail">{event.detail}</div> : null}
          </div>
        </li>
      ))}
    </InView>
  )
}
