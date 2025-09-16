import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Activity, Shield, Users, Server } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlassCard } from "@/components/GlassCard";
import { SummaryPage } from "@/components/pages/SummaryPage";
import { M365Page } from "@/components/pages/M365Page";
import { ProofpointPage } from "@/components/pages/ProofpointPage";
import { DuoPage } from "@/components/pages/DuoPage";
import { S1Page } from "@/components/pages/S1Page";
import { DEMO_CLIENTS, applyScenario, type ScenarioType, type ClientData } from "@/data/demoData";
import { useToast } from "@/hooks/use-toast";
import KlhreportingappLogo from "@/assets/Klhreportingapp-logo.jpg";


import { loadM365LiveData } from "@/lib/m365Live";

const Index = () => {
  const { toast } = useToast();

  const clientNames = useMemo(() => Object.keys(DEMO_CLIENTS), []);
  const scenarios: ScenarioType[] = ["Default", "Light Tenant", "Security-Heavy", "Empty"];

  const [selectedClient, setSelectedClient] = useState<string>(clientNames[0] ?? "Contoso Ltd.");
  const [scenario, setScenario] = useState<ScenarioType>("Default");
  const [services, setServices] = useState({ m365: true, pp: true, duo: true, s1: true });

  const [data, setData] = useState<ClientData>(() => {
    const base = DEMO_CLIENTS[selectedClient] || {};
    return applyScenario(base, scenario);
  });


  const refreshData = async (reason: string) => {
    const base = DEMO_CLIENTS[selectedClient] || {};
    let processed = applyScenario(base, scenario);

    // If Academic Therapy Publications is selected, try to overlay live M365 (dev only)
    const isATP = /academic therapy publications/i.test(selectedClient);
    if (isATP && services.m365) {
      try {
        const live = await loadM365LiveData();
        processed = { ...processed, ...live };
      } catch (err) {
        console.error("Live M365 load failed:", err);
        toast({
          title: "Live data unavailable",
          description:
            "Falling back to demo data. Check VITE_USE_LOCAL_CREDS, your JSON cred file, or API permissions.",
          variant: "destructive",
        });
      }
    }


    if (!services.m365) processed.m365 = undefined;
    if (!services.pp) processed.pp = undefined;
    if (!services.duo) processed.duo = undefined;
    if (!services.s1) processed.s1 = undefined;

    setData(processed);

    toast({
      title: "Data refreshed",
      description: `${reason} — ${selectedClient} (${scenario})`,
    });
  };

  // Refresh when key inputs change
  useEffect(() => {
    void refreshData("Selection updated");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient, scenario, services.m365, services.pp, services.duo, services.s1]);

  const handleManualRefresh = () => {
    void refreshData("Manual refresh");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-glass-border backdrop-blur-xl bg-glass-light/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 slide-up">
              <img
                src={KlhreportingappLogo}
                alt="Klhreportingapp Consulting"
                className="h-12 w-auto object-contain float"
              />
              <div>
                <h1 className="text-3xl font-bold text-gradient leading-tight">Client Reporting Dashboard</h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Klhreportingapp Consulting - Modern Analytics Platform
                </p>
              </div>
            </div>
            <div className="scale-in">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6 fade-in" style={{ animationDelay: "0.1s" }}>
            {/* Client Selection */}
            <GlassCard className="hover-glow">
              <h2 className="text-xl font-bold mb-6 text-gradient">Clients</h2>
              <div className="space-y-3">
                {clientNames.map((client, index) => (
                  <Button
                    key={client}
                    variant={selectedClient === client ? "default" : "outline"}
                    className={`w-full justify-start btn-modern transition-all duration-300 ${
                      selectedClient === client ? "scale-105" : "hover:scale-102"
                    }`}
                    onClick={() => setSelectedClient(client)}
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    <span className="font-medium">{client}</span>
                  </Button>
                ))}
              </div>
            </GlassCard>

            {/* Scenario Selection */}
            <GlassCard className="hover-glow">
              <h2 className="text-xl font-bold mb-6 text-gradient">Demo Scenario</h2>
              <Select value={scenario} onValueChange={(value: ScenarioType) => setScenario(value)}>
                <SelectTrigger className="glass-card bg-glass-light border-glass-border backdrop-blur-sm hover:bg-glass-light/80 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border backdrop-blur-xl bg-glass-light/95">
                  {scenarios.map((scen) => (
                    <SelectItem key={scen} value={scen} className="hover:bg-glass-light/50 transition-colors">
                      {scen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GlassCard>

            {/* Service Toggles */}
            <GlassCard className="hover-glow">
              <h2 className="text-xl font-bold mb-6 text-gradient">Services</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-glass-light/30 transition-colors">
                  <Checkbox
                    id="m365"
                    checked={services.m365}
                    onCheckedChange={(checked) => setServices((p) => ({ ...p, m365: !!checked }))}
                    className="border-2 data-[state=checked]:bg-services-m365 data-[state=checked]:border-services-m365"
                  />
                  <label
                    htmlFor="m365"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Microsoft 365
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-glass-light/30 transition-colors">
                  <Checkbox
                    id="pp"
                    checked={services.pp}
                    onCheckedChange={(checked) => setServices((p) => ({ ...p, pp: !!checked }))}
                    className="border-2 data-[state=checked]:bg-services-proofpoint data-[state=checked]:border-services-proofpoint"
                  />
                  <label
                    htmlFor="pp"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Proofpoint
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-glass-light/30 transition-colors">
                  <Checkbox
                    id="duo"
                    checked={services.duo}
                    onCheckedChange={(checked) => setServices((p) => ({ ...p, duo: !!checked }))}
                    className="border-2 data-[state=checked]:bg-services-duo data-[state=checked]:border-services-duo"
                  />
                  <label
                    htmlFor="duo"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Duo Security
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-glass-light/30 transition-colors">
                  <Checkbox
                    id="s1"
                    checked={services.s1}
                    onCheckedChange={(checked) => setServices((p) => ({ ...p, s1: !!checked }))}
                    className="border-2 data-[state=checked]:bg-services-s1 data-[state=checked]:border-services-s1"
                  />
                  <label
                    htmlFor="s1"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    SentinelOne
                  </label>
                </div>
              </div>
            </GlassCard>

            {/* Refresh Button */}
            <Button
              onClick={handleManualRefresh}
              className="w-full btn-modern text-white font-semibold py-4 text-base shadow-lg"
              size="lg"
            >
              <RefreshCw className="mr-3 h-5 w-5" />
              Refresh Demo
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 fade-in" style={{ animationDelay: "0.2s" }}>
            <GlassCard className="h-full hover-glow" style={{ minHeight: "80vh" }}>
              <Tabs defaultValue="summary" className="h-full">
                <TabsList className="grid w-full grid-cols-5 glass-card bg-glass-light/50 backdrop-blur-sm p-2 h-auto">
                  <TabsTrigger
                    value="summary"
                    className="flex items-center gap-2 py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Summary</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="m365"
                    disabled={!data.m365}
                    className="flex items-center gap-2 py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-services-m365 data-[state=active]:text-white disabled:opacity-50"
                  >
                    <div className="w-3 h-3 bg-services-m365 rounded-full" />
                    <span className="hidden sm:inline">M365</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="proofpoint"
                    disabled={!data.pp}
                    className="flex items-center gap-2 py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-services-proofpoint data-[state=active]:text-white disabled:opacity-50"
                  >
                    <div className="w-3 h-3 bg-services-proofpoint rounded-full" />
                    <span className="hidden sm:inline">Proofpoint</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="duo"
                    disabled={!data.duo}
                    className="flex items-center gap-2 py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-services-duo data-[state=active]:text-white disabled:opacity-50"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Duo</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="s1"
                    disabled={!data.s1}
                    className="flex items-center gap-2 py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-services-s1 data-[state=active]:text-white disabled:opacity-50"
                  >
                    <Server className="h-4 w-4" />
                    <span className="hidden sm:inline">S1</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="summary" className="space-y-8">
                    <SummaryPage data={data} />
                  </TabsContent>

                  <TabsContent value="m365">
                    <M365Page data={data.m365} />
                  </TabsContent>

                  <TabsContent value="proofpoint">
                    <ProofpointPage data={data.pp} />
                  </TabsContent>

                  <TabsContent value="duo">
                    <DuoPage data={data.duo} />
                  </TabsContent>

                  <TabsContent value="s1">
                    <S1Page data={data.s1} />
                  </TabsContent>
                </div>
              </Tabs>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

