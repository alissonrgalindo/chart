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

const initialInstallsState = () => 
  Object.fromEntries(weekDays.map((d) => [d, "0"])) as Record<WeekDay, string>

export function CreateCampaignDialog() {
  const { campaigns, addCampaign } = useCampaigns()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [installs, setInstalls] = useState<Record<WeekDay, string>>(initialInstallsState())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (day: WeekDay, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setInstalls((prev) => ({ ...prev, [day]: value }))
    }
  }

  const resetForm = () => {
    setName("")
    setInstalls(initialInstallsState())
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Campaign name is required")
      return false
    }

    const exists = campaigns.some(
      (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
    )

    if (exists) {
      toast.error("Campaign name already exists")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const newCampaign = {
        id: crypto.randomUUID(),
        name: name.trim(),
        installs: weekDays.map((day) => ({
          day,
          value: Number(installs[day] || 0),
        })),
      }

      addCampaign(newCampaign)
      toast.success("Campaign created successfully")
      resetForm()
      setTimeout(() => setOpen(false), 100)
    } catch (error) {
      toast.error("Failed to create campaign")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyTemplate = (template: "weekend" | "weekday" | "equal") => {
    const newInstalls = { ...installs }
    
    if (template === "weekend") {
      weekDays.forEach(day => {
        newInstalls[day] = ["saturday", "sunday"].includes(day) ? "100" : "20"
      })
    } else if (template === "weekday") {
      weekDays.forEach(day => {
        newInstalls[day] = ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day) ? "80" : "30"
      })
    } else if (template === "equal") {
      weekDays.forEach(day => {
        newInstalls[day] = "50"
      })
    }
    
    setInstalls(newInstalls)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when dialog is closed
        resetForm()
      }
      setOpen(newOpen)
    }}>
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
              placeholder="Enter campaign name"
              required
              autoFocus
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Daily Installs</Label>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyTemplate("equal")}
                >
                  Equal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyTemplate("weekday")}
                >
                  Weekday
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyTemplate("weekend")}
                >
                  Weekend
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {weekDays.map((day) => (
                <div key={day}>
                  <Label htmlFor={day} className="capitalize">
                    {day}
                  </Label>
                  <Input
                    id={day}
                    type="text"
                    inputMode="numeric"
                    min="0"
                    value={installs[day]}
                    onChange={(e) => handleChange(day, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
            >
              Reset
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}