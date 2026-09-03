"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

import { columnService } from "@/services/column.service"
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

const createColumnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(100, "Column name must be 100 characters or fewer"),
})

type CreateColumnFormValues = z.infer<typeof createColumnSchema>

interface CreateColumnDialogProps {
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateColumnDialog({
  boardId,
  open,
  onOpenChange,
  onSuccess,
}: CreateColumnDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<CreateColumnFormValues>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  async function handleSubmit(values: CreateColumnFormValues) {
    if (!boardId) return
    setIsSubmitting(true)
    try {
      const response = await columnService.createColumn(boardId, values)
      if (response.success) {
        toast.success(response.message || "Column created successfully")
        form.reset()
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to create column")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to create column"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Column
          </DialogTitle>
          <DialogDescription>
            Enter a title for the column (e.g., To Do, In Progress, Review, Done).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. To Do, In Progress"
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
                    Adding...
                  </>
                ) : (
                  "Add Column"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
