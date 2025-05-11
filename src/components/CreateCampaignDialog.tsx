import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useCampaigns } from "@/hooks/useCampaigns"
import type { WeekDay } from "@/store/campaignStore"

const weekDays: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

export function CreateCampaignDialog() {
  const { campaigns, addCampaign } = useCampaigns()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [installs, setInstalls] = useState<Record<WeekDay, string>>(
    Object.fromEntries(weekDays.map((d) => [d, "0"])) as Record<WeekDay, string>
  )

  const handleChange = (day: WeekDay, value: string) => {
    setInstalls((prev) => ({ ...prev, [day]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const exists = campaigns.some(
      (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
    )

    if (exists) {
      toast.error("Campaign name already exists")
      return
    }

    const newCampaign = {
      id: crypto.randomUUID(),
      name: name.trim(),
      installs: weekDays.map((day) => ({
        day,
        value: Number(installs[day]),
      })),
    }

    addCampaign(newCampaign)
    toast.success("Campaign created successfully")

    setName("")
    setInstalls(Object.fromEntries(weekDays.map((d) => [d, "0"])) as Record<WeekDay, string>)

    setTimeout(() => setOpen(false), 100)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <PlusIcon />
          <span>Create Campaign</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Campaign</DialogTitle>
          <DialogDescription>
            Fill out the details to create a new campaign.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {weekDays.map((day) => (
              <div key={day}>
                <Label htmlFor={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Label>
                <Input
                  id={day}
                  type="number"
                  min="0"
                  value={installs[day]}
                  onChange={(e) => handleChange(day, e.target.value)}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit">Create</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
