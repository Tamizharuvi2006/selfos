import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, Shield, Clock, FileText } from 'lucide-react';
import cyberData from '@/mock-data/cybersecurity.json';
const severityColor: Record<string, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};
const NetworkDashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="glass">
      <CardHeader>
        <CardTitle>Network Traffic (Mbps)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cyberData.networkMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Line type="monotone" dataKey="traffic" stroke="hsl(var(--neon-cyan))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="glass">
      <CardHeader>
        <CardTitle>Threats Detected</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cyberData.networkMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="threats" fill="hsl(var(--neon-magenta))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);
const ForensicsTimeline = () => (
  <Card className="glass h-full">
    <CardHeader>
      <CardTitle>Forensics Event Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[450px] pr-4">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
          {cyberData.forensicsEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="mb-8 pl-6 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute -left-2.5 top-1 w-5 h-5 bg-accent rounded-full border-4 border-card" />
              <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
              <h4 className="font-semibold">{event.type}</h4>
              <p className="text-sm">{event.description}</p>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);
const PentestingTools = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<typeof cyberData.vulnerabilities>([]);
  const startScan = () => {
    setIsScanning(true);
    setResults([]);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResults(cyberData.vulnerabilities);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Vulnerability Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={startScan} disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Start Network Scan'}
            </Button>
            {isScanning && <Progress value={scanProgress} className="w-1/2" />}
          </div>
        </CardContent>
      </Card>
      {results.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Remediation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(vuln => (
                  <TableRow key={vuln.id}>
                    <TableCell>
                      <Badge className={`${severityColor[vuln.severity]}`}>{vuln.severity}</Badge>
                    </TableCell>
                    <TableCell>{vuln.description}</TableCell>
                    <TableCell>{vuln.remediation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
const CybersecuritySuite: React.FC = () => {
  return (
    <div className="h-full w-full bg-transparent text-foreground p-4">
      <Tabs defaultValue="dashboard" className="h-full flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard"><Shield className="w-4 h-4 mr-2" />Dashboard</TabsTrigger>
          <TabsTrigger value="forensics"><Clock className="w-4 h-4 mr-2" />Forensics</TabsTrigger>
          <TabsTrigger value="pentesting"><AlertTriangle className="w-4 h-4 mr-2" />Pentesting</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="flex-1 overflow-y-auto">
          <NetworkDashboard />
        </TabsContent>
        <TabsContent value="forensics" className="flex-1 overflow-y-auto">
          <ForensicsTimeline />
        </TabsContent>
        <TabsContent value="pentesting" className="flex-1 overflow-y-auto">
          <PentestingTools />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default CybersecuritySuite;