import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { preSurveyCategories } from "@/data/preSurveyQuestions";
import { postSurveyCategories } from "@/data/postSurveyQuestions";

interface UserQuestionnaireTabProps {
  userId: string;
}

export const UserQuestionnaireTab = ({ userId }: UserQuestionnaireTabProps) => {
  const { data: preSurveyResponses, isLoading: loadingPre } = useQuery({
    queryKey: ["admin-pre-survey", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_survey_responses")
        .select("*")
        .eq("user_id", userId)
        .order("category_code", { ascending: true })
        .order("question_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: postSurveyResponses, isLoading: loadingPost } = useQuery({
    queryKey: ["admin-post-survey", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_survey_responses")
        .select("*")
        .eq("user_id", userId)
        .order("category_code", { ascending: true })
        .order("question_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getQuestionText = (
    categoryCode: string,
    questionIndex: number,
    isPre: boolean
  ): string => {
    const categories = isPre ? preSurveyCategories : postSurveyCategories;
    const category = categories.find((c) => c.code === categoryCode);
    if (!category) return "Unknown question";
    const question = category.questions[questionIndex];
    return question?.text || "Unknown question";
  };

  const getCategoryName = (categoryCode: string, isPre: boolean): string => {
    const categories = isPre ? preSurveyCategories : postSurveyCategories;
    const category = categories.find((c) => c.code === categoryCode);
    return category?.name || categoryCode;
  };

  const exportToExcel = (isPre: boolean) => {
    const responses = isPre ? preSurveyResponses : postSurveyResponses;
    if (!responses || responses.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = responses.map((r) => ({
      Category: getCategoryName(r.category_code, isPre),
      "Category Code": r.category_code,
      "Question Index": r.question_index + 1,
      Question: getQuestionText(r.category_code, r.question_index, isPre),
      "Response Value": r.response_value,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isPre ? "Pre-Survey" : "Post-Survey");

    const filename = `${isPre ? "pre" : "post"}_survey_${userId.slice(0, 8)}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success("Excel file downloaded");
  };

  const renderResponsesTable = (
    responses: any[] | undefined,
    isLoading: boolean,
    isPre: boolean
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (!responses || responses.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No responses recorded
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => exportToExcel(isPre)}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
        <div className="rounded-md border max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[100px] text-center">Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant="outline">{response.category_code}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getQuestionText(response.category_code, response.question_index, isPre)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{response.response_value}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Questionnaire Responses
        </CardTitle>
        <CardDescription>
          View and export user questionnaire responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pre">
          <TabsList className="mb-4">
            <TabsTrigger value="pre">
              Pre-Survey
              {preSurveyResponses && preSurveyResponses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {preSurveyResponses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="post">
              Post-Survey
              {postSurveyResponses && postSurveyResponses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {postSurveyResponses.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pre">
            {renderResponsesTable(preSurveyResponses, loadingPre, true)}
          </TabsContent>

          <TabsContent value="post">
            {renderResponsesTable(postSurveyResponses, loadingPost, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
