"use client"

import * as React from "react"

import { columnService } from "@/services/column.service"
import { taskService } from "@/services/task.service"
import { Board } from "@/types/board"
import { Task } from "@/types/task"

export interface DashboardTask extends Task {
  boardId: string
  boardName: string
  columnName: string
}

export interface BoardCountStats {
  columnCount: number
  taskCount: number
}

export interface DashboardOverviewData {
  tasks: DashboardTask[]
  totalTasks: number
  completedTasks: number
  todoTasks: number
  progressTasks: number
  doneTasks: number
  boardStats: Record<string, BoardCountStats>
}

const emptyOverview: DashboardOverviewData = {
  tasks: [],
  totalTasks: 0,
  completedTasks: 0,
  todoTasks: 0,
  progressTasks: 0,
  doneTasks: 0,
  boardStats: {},
}

function getColumnBucket(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes("done") || normalized.includes("complete")) return "done"
  if (normalized.includes("progress") || normalized.includes("review") || normalized.includes("doing")) return "progress"
  return "todo"
}

export function useDashboardOverview(boards: Board[]) {
  const [overview, setOverview] = React.useState<DashboardOverviewData>(emptyOverview)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    let isCurrent = true

    async function loadOverview() {
      if (boards.length === 0) {
        setOverview(emptyOverview)
        return
      }

      setIsLoading(true)
      const boardResults = await Promise.all(
        boards.map(async (board) => {
          const columnsResponse = await columnService.getColumns(board.id)
          const columns = columnsResponse.success ? columnsResponse.data || [] : []
          const taskResults = await Promise.all(
            columns.map(async (column) => {
              const response = await taskService.getTasks(column.id)
              return {
                column,
                tasks: response.success ? response.data || [] : [],
              }
            })
          )
          return { board, taskResults }
        })
      )

      if (!isCurrent) return

      const tasks: DashboardTask[] = []
      let todoTasks = 0
      let progressTasks = 0
      let doneTasks = 0

      const boardStats: Record<string, BoardCountStats> = {}

      boardResults.forEach(({ board, taskResults }) => {
        const columnCount = taskResults.length
        let boardTaskCount = 0

        taskResults.forEach(({ column, tasks: columnTasks }) => {
          boardTaskCount += columnTasks.length
          const bucket = getColumnBucket(column.name)
          if (bucket === "done") doneTasks += columnTasks.length
          else if (bucket === "progress") progressTasks += columnTasks.length
          else todoTasks += columnTasks.length

          columnTasks.forEach((task) => {
            tasks.push({
              ...task,
              boardId: board.id,
              boardName: board.name,
              columnName: column.name,
            })
          })
        })

        boardStats[board.id] = {
          columnCount,
          taskCount: boardTaskCount,
        }
      })

      setOverview({
        tasks: tasks.sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()),
        totalTasks: tasks.length,
        completedTasks: doneTasks,
        todoTasks,
        progressTasks,
        doneTasks,
        boardStats,
      })
      setIsLoading(false)
    }

    void loadOverview()
    return () => {
      isCurrent = false
    }
  }, [boards])

  return { overview, isLoading }
}
