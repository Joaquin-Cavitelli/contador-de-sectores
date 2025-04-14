"use client"

import { useState, useEffect } from "react"

function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        setIsComplete(true)
        onComplete()
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isComplete) {
    return null
  }

  return (
    <div className="pt-8 text-gray-600">
      <h3 className="text-center text-base  mb-4">Tiempo para iniciar el conteo</h3>
      <div className="grid grid-cols-1 gap-3 text-center pt-2 max-w-lg mx-auto">
        {timeLeft.days > 0 && (
          <div className="flex flex-col">
            <span className="text-5xl font-bold">{timeLeft.days}</span>
            <span className=" text-gray-500">Días</span>
          </div>
        )}
        {timeLeft.hours > 0 && (
          <div className="flex flex-col">
            <span className="text-5xl font-bold">
              {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
              </span>
            <span className=" text-gray-500">Horas</span>
          </div>
        )}
        
          <div className="flex flex-col">
            <span className="text-5xl font-bold">
              {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
            </span>
            <span className=" text-gray-500">Min</span>
          </div>
        
        
          <div className="flex flex-col">
            <span className="text-5xl font-bold">
              {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
              </span>
            <span className=" text-gray-500">Seg</span>
          </div>
        
      
      </div>
    </div>
  )
}

export default CountdownTimer
