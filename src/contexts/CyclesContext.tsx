import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from 'react'
import {
  addNewCycleAction,
  interruptCycleAction,
  markCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  createNewCycle: (data: CreateCycleData) => void
  interruptCycle: (cycleId: string) => void
  markCycleAsFinished: (cycleId: string) => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ingnite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

        return {
          cycles: [],
        }
    },
  )
  const { cycles } = cyclesState

  function markCycleAsFinished(cycleId: string) {
    dispatch(markCycleAsFinishedAction(cycleId))
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCycle(cycleId: string) {
    dispatch(interruptCycleAction(cycleId))
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ingnite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        createNewCycle,
        interruptCycle,
        markCycleAsFinished,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
