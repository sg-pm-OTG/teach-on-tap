import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  date_of_birth: string;
  gender: string;
  years_teaching_experience: number;
  pre_survey_completed: boolean;
  post_survey_completed: boolean;
  baseline_completed: boolean;
  masterclass_attended: boolean;
  final_report_status: string;
  launch_huddle_attended: boolean;
  created_at: string;
  sessions_count?: number;
}

const UsersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterPreSurvey, setFilterPreSurvey] = useState<string>("all");
  const [filterBaseline, setFilterBaseline] = useState<string>("all");
  const [filterMasterclass, setFilterMasterclass] = useState<string>("all");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("admin-list-all-users", {
        headers: {
          Authorization: `Bearer ${session?.session?.access_token}`,
        },
      });
      if (response.error) throw response.error;
      return response.data.users as UserProfile[];
    },
  });

  const filteredUsers = users?.filter((user) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !user.name.toLowerCase().includes(searchLower) &&
        !user.user_id.toLowerCase().includes(searchLower) &&
        !(user.email?.toLowerCase().includes(searchLower))
      ) {
        return false;
      }
    }

    // Pre-survey filter
    if (filterPreSurvey !== "all") {
      if (filterPreSurvey === "completed" && !user.pre_survey_completed) return false;
      if (filterPreSurvey === "pending" && user.pre_survey_completed) return false;
    }

    // Baseline filter
    if (filterBaseline !== "all") {
      if (filterBaseline === "completed" && !user.baseline_completed) return false;
      if (filterBaseline === "pending" && user.baseline_completed) return false;
    }

    // Masterclass filter
    if (filterMasterclass !== "all") {
      if (filterMasterclass === "attended" && !user.masterclass_attended) return false;
      if (filterMasterclass === "pending" && user.masterclass_attended) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          {users?.length || 0} registered users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPreSurvey} onValueChange={setFilterPreSurvey}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Pre-Survey" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pre-Survey</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBaseline} onValueChange={setFilterBaseline}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Baseline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Baseline</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMasterclass} onValueChange={setFilterMasterclass}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Masterclass" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Masterclass</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/users/${user.user_id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.email || "—"}
                      </TableCell>
                      <TableCell>
                        {user.years_teaching_experience} years
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {user.sessions_count} sessions
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <Badge
                            variant={user.pre_survey_completed ? "default" : "outline"}
                            className="text-xs"
                          >
                            Pre-Survey
                          </Badge>
                          <Badge
                            variant={user.baseline_completed ? "default" : "outline"}
                            className="text-xs"
                          >
                            Baseline
                          </Badge>
                          <Badge
                            variant={user.masterclass_attended ? "default" : "outline"}
                            className="text-xs"
                          >
                            Masterclass
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
