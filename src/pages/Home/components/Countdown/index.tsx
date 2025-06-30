import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'
import { Cycle } from '../../../../reducers/cycles/reducer'

interface CountdownProps {
  cycle: Cycle
}

export function Countdown({ cycle }: CountdownProps) {
  const { markCycleAsFinished } = useContext(CyclesContext)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    return differenceInSeconds(new Date(), new Date(cycle.startDate))
  })

  const totalSeconds = cycle.minutesAmount * 60

  const currentSeconds = totalSeconds - amountSecondsPassed
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    document.title = `${cycle.task} - ${minutes}:${seconds}`
  }, [minutes, seconds, cycle.task])

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsDifference = differenceInSeconds(
        new Date(),
        new Date(cycle.startDate),
      )

      if (secondsDifference >= totalSeconds) {
        markCycleAsFinished(cycle.id)
        setAmountSecondsPassed(totalSeconds)
        clearInterval(interval)
      } else {
        setAmountSecondsPassed(secondsDifference)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [cycle.id, cycle.startDate, totalSeconds, markCycleAsFinished])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
