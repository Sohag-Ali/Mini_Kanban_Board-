"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Pencil } from "lucide-react"

import { Board, UpdateBoardPayload } from "@/types/board"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const editBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name must be 100 characters or fewer"),
})

type EditBoardFormValues = z.infer<typeof editBoardSchema>

interface EditBoardDialogProps {
  board: Board | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    id: string,
    payload: UpdateBoardPayload
  ) => Promise<{ success: boolean; error?: string }>
}

export function EditBoardDialog({
  board,
  open,
  onOpenChange,
  onSubmit,
}: EditBoardDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<EditBoardFormValues>({
    resolver: zodResolver(editBoardSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (board && open) {
      form.reset({ name: board.name })
    }
  }, [board, open, form])

  async function handleSubmit(values: EditBoardFormValues) {
    if (!board) return
    setIsSubmitting(true)
    const result = await onSubmit(board.id, values)
    setIsSubmitting(false)
    if (result.success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Board
          </DialogTitle>
          <DialogDescription>
            Update the title of your Kanban board.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Project Roadmap"
                      disabled={isSubmitting}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
