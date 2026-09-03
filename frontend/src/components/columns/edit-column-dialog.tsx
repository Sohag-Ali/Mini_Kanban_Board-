"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Pencil } from "lucide-react"

import { columnService } from "@/services/column.service"
import { Column } from "@/types/column"
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

const editColumnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(100, "Column name must be 100 characters or fewer"),
})

type EditColumnFormValues = z.infer<typeof editColumnSchema>

interface EditColumnDialogProps {
  boardId: string
  column: Column | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditColumnDialog({
  boardId,
  column,
  open,
  onOpenChange,
  onSuccess,
}: EditColumnDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<EditColumnFormValues>({
    resolver: zodResolver(editColumnSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (column && open) {
      form.reset({ name: column.name })
    }
  }, [column, open, form])

  async function handleSubmit(values: EditColumnFormValues) {
    if (!boardId || !column) return
    setIsSubmitting(true)
    try {
      const response = await columnService.updateColumn(
        boardId,
        column.id,
        values
      )
      if (response.success) {
        toast.success(response.message || "Column updated successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to update column")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to update column"
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
            <Pencil className="h-5 w-5 text-primary" />
            Edit Column Name
          </DialogTitle>
          <DialogDescription>
            Update the title of this column.
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
                      placeholder="e.g. In Progress"
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
