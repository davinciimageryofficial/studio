
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Eye, DollarSign, Target, MousePointerClick, Kanban, CheckCircle, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { analyzeAdCampaign, AdCampaignAnalyzerOutput } from "@/ai/flows/ad-campaign-analyzer";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { ClientOnly } from "@/components/layout/client-only";
import { getCampaigns, createCampaignInDb } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const campaignFormSchema = z.object({
  name: z.string().min(1, "Campaign name is required."),
  type: z.enum(['profile-spotlight', 'product-listing', 'sponsored-content', 'job-gig'], {
      errorMap: () => ({ message: "Please select an ad type." }),
  }),
  content: z.string().min(1, "Ad content is required."),
  keywords: z.string().min(1, "At least one keyword is required."),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;
type Campaign = {
    id: number;
    name: string;
    status: string;
    type: string;
    spend: number;
    conversions: number;
}

function AdStudioPageInternal({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    const fetchedCampaigns = await getCampaigns();
    setCampaigns(fetchedCampaigns);
    setIsLoading(false);
  }, []);
  
  const handleCampaignCreated = () => {
    loadCampaigns();
    setIsDialogOpen(false); // Close dialog on success
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.adStudioTitle}</h1>
            <p className="mt-1 text-muted-foreground">
                {t.adStudioDescription}
            </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t.createCampaign}
                </Button>
            </DialogTrigger>
            <CreateCampaignDialog t={t} onCampaignCreated={handleCampaignCreated} />
        </Dialog>
      </header>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black text-muted-foreground">
          <TabsTrigger value="campaigns">{t.campaigns}</TabsTrigger>
          <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
          <TabsTrigger value="audiences">{t.audiences}</TabsTrigger>
          <TabsTrigger value="billing">{t.billing}</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.yourCampaigns}</CardTitle>
                    <CardDescription>{t.yourCampaignsDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.campaignName}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead>{t.type}</TableHead>
                                <TableHead>{t.spend}</TableHead>
                                <TableHead>{t.conversions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map(campaign => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{campaign.type}</TableCell>
                                    <TableCell>${campaign.spend.toLocaleString()}</TableCell>
                                    <TableCell>{campaign.conversions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.analyticsDashboard}</CardTitle>
                    <CardDescription>{t.analyticsDashboardDesc}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.impressions}</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.2M</div>
                            <p className="text-xs text-muted-foreground">{t.fromLastMonth}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.totalSpend}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$2,650</div>
                             <p className="text-xs text-muted-foreground">+40% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.conversions}</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+685</div>
                             <p className="text-xs text-muted-foreground">+22.1% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.ctr}</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.8%</div>
                             <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="audiences" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>{t.audienceManagement}</CardTitle>
                    <CardDescription>{t.audienceManagementDesc}</CardDescription>
                </CardHeader>
                <CardContent className="min-h-96 flex items-center justify-center text-muted-foreground">
                    <p>{t.audienceToolsComingSoon}</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.billingAndAds}</CardTitle>
                    <CardDescription>{t.billingAndAdsDesc}</CardDescription>
                </CardHeader>
                <CardContent className="min-h-96 flex items-center justify-center text-muted-foreground">
                    <p>{t.billingToolsComingSoon}</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default async function AdStudioPage() {
    const campaigns = await getCampaigns();
    return (
        <ClientOnly>
            <AdStudioPageInternal initialCampaigns={campaigns} />
        </ClientOnly>
    );
}

function CreateCampaignDialog({ t, onCampaignCreated }: { t: typeof translations['en'], onCampaignCreated: () => void }) {
    const [analysis, setAnalysis] = useState<AdCampaignAnalyzerOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    const form = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignFormSchema),
        defaultValues: {
            name: "",
            content: "",
            keywords: "",
        }
    });

    const watchedFields = form.watch();

    const triggerAnalysis = useCallback(async (data: {name: string, content: string, keywords: string, type: any}) => {
        if (!data.name && !data.content && !data.keywords) {
            setAnalysis(null);
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeAdCampaign({
                campaignName: data.name,
                adContent: data.content,
                targetingKeywords: data.keywords,
                adType: data.type,
            });
            setAnalysis(result);
        } catch (e) {
            setError("AI analysis failed. Please try again.");
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            const { name, content, keywords, type } = form.getValues();
            if (type) { // Only run analysis if a type is selected
                triggerAnalysis({ name, content, keywords, type });
            }
        }, 1000); // 1-second debounce

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [watchedFields, triggerAnalysis, form]);
    
    const onSubmit = async (data: CampaignFormValues) => {
        setIsSubmitting(true);
        const result = await createCampaignInDb(data);
        if (result.error) {
            toast({
                title: "Error Creating Campaign",
                description: result.error,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Campaign Launched!",
                description: "Your new ad campaign is now active.",
            });
            onCampaignCreated();
        }
        setIsSubmitting(false);
    };

    return (
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{t.createCampaignTitle}</DialogTitle>
                <DialogDescription>
                    {t.createCampaignDesc}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                    {/* Main Form */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="campaign-name">{t.campaignName}</Label>
                            <Input id="campaign-name" placeholder={t.campaignNamePlaceholder} {...form.register("name")} />
                            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>{t.adType}</Label>
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field }) => (
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue placeholder={t.adTypePlaceholder} /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="profile-spotlight">{t.adTypeProfile}</SelectItem>
                                            <SelectItem value="product-listing">{t.adTypeProduct}</SelectItem>
                                            <SelectItem value="sponsored-content">{t.adTypeContent}</SelectItem>
                                            <SelectItem value="job-gig">{t.adTypeJob}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                             {form.formState.errors.type && <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="ad-content">{t.adContent}</Label>
                            <Textarea id="ad-content" placeholder={t.adContentPlaceholder} className="min-h-32" {...form.register("content")} />
                            {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="targeting-keywords">{t.targetingKeywords}</Label>
                            <Input id="targeting-keywords" placeholder={t.targetingKeywordsPlaceholder} {...form.register("keywords")} />
                             {form.formState.errors.keywords && <p className="text-sm text-destructive">{form.formState.errors.keywords.message}</p>}
                        </div>

                    </div>
                    {/* Pocket Guide */}
                    <div className="space-y-4 md:border-l md:pl-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                           <Kanban className="w-5 h-5 text-primary" />
                           {t.pocketGuide}
                        </h3>
                        <div className="text-sm space-y-4">
                             {isAnalyzing ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : error ? (
                                 <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t.analysisError}</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : analysis ? (
                                <div className="space-y-4">
                                    {analysis.campaignNameStrength && (
                                        <div>
                                            <h4 className="font-semibold">{t.campaignNameStrength}</h4>
                                            <Progress value={analysis.campaignNameStrength.score} className="my-2 h-2" />
                                            <p className="text-muted-foreground">{analysis.campaignNameStrength.feedback}</p>
                                        </div>
                                    )}
                                     {analysis.adContentSuggestions && analysis.adContentSuggestions.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold">{t.contentSuggestions}</h4>
                                            <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                                                {analysis.adContentSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                     {analysis.keywordSuggestions && analysis.keywordSuggestions.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold">{t.keywordSuggestions}</h4>
                                             <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                                                {analysis.keywordSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">
                                    <p>{t.pocketGuideDesc}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">{t.cancel}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Launching..." : t.launchCampaign}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

    