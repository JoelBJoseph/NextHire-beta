import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Save } from "lucide-react"

export default function AdminEdit() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and configurations.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>Application Form Settings</CardTitle>
              <CardDescription>Customize the fields and requirements for job applications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Configure which fields are required and visible in the application form.
          </p>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

