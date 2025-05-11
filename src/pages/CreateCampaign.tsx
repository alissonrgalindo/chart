import { useState } from "react"
import { useCampaigns } from "@/hooks/useCampaigns"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

export default function CreateCampaign() {
  const { campaigns } = useCampaigns()
  const [name, setName] = useState("")
  const [installs, setInstalls] = useState(
    Object.fromEntries(weekDays.map((day) => [day, "0"]))
  )
  const [loading, setLoading] = useState(false)

  const handleChange = (day: string, value: string) => {
    setInstalls((prev) => ({ ...prev, [day]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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

      const stored = JSON.parse(localStorage.getItem("customCampaigns") || "[]")
      localStorage.setItem("customCampaigns", JSON.stringify([...stored, newCampaign]))

      toast.success("Campaign created successfully!")
      setName("")
      setInstalls(Object.fromEntries(weekDays.map((day) => [day, "0"])))
    } catch {
      toast.error("Something went wrong while saving the campaign.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter campaign name"
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
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
