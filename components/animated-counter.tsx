"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  value: string
  label: string
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const parseValue = (val: string) => {
    const match = val.match(/(\d+)(.*)/)
    return {
      num: match ? Number.parseInt(match[1]) : 0,
      suffix: match ? match[2] : "",
    }
  }

  const { num, suffix } = parseValue(value)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let currentValue = 0
    const increment = Math.ceil(num / 50) // Divide animation into 50 steps
    const interval = setInterval(() => {
      currentValue += increment
      if (currentValue >= num) {
        setDisplayValue(num)
        clearInterval(interval)
      } else {
        setDisplayValue(currentValue)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isVisible, num])

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="text-4xl md:text-5xl font-bold text-accent-orange mb-2">
        {displayValue}
        {suffix}
      </div>
      <p className="text-white/80">{label}</p>
    </div>
  )
}
