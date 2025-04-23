import { useState } from 'react';
import HashGenerator from '@/components/HashGenerator';
import HashVerifier from '@/components/HashVerifier';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, HashIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="flex flex-col items-center mb-12 relative">
          <div className="absolute top-4 left-4 md:top-8 md:left-8">
            <a
              href="https://github.com/prijal-bista/jwt-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed top-4 left-4 z-50"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-card hover:bg-accent border-primary/20"
              >
                <Github className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">View source on GitHub</span>
              </Button>
            </a>
          </div>
          <div className="fixed top-4 right-4">
            <ThemeToggle />
          </div>

          <div className="relative mt-4">
            <h1 className="relative px-4 pt-1 text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-600">
                Bcrypt Hash Generator/Verifier
              </span>
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-center mt-4">
            A modern, secure browser based tool to generate and verify password
            hashes
          </p>
        </header>

        <main>
          <Tabs
            defaultValue="generate"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/30">
              <TabsTrigger
                value="generate"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                <HashIcon className="h-4 w-4" />
                Generate Hash
              </TabsTrigger>
              <TabsTrigger
                value="verify"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                <ShieldCheckIcon className="h-4 w-4" />
                Verify Hash
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 opacity-30 blur-sm"></div>
              <div className="relative backdrop-blur-sm bg-white/60 dark:bg-slate-900/60 shadow-xl rounded-xl overflow-hidden border border-white/50 dark:border-slate-800/50 p-6">
                <TabsContent value="generate" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-400">
                    Generate Hash
                  </h2>
                  <HashGenerator />
                </TabsContent>

                <TabsContent value="verify" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-400">
                    Verify Hash
                  </h2>
                  <HashVerifier />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
