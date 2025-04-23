import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { CopyIcon, KeyIcon, LoaderCircleIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import bcrypt from 'bcryptjs';
import { shaHash } from '@/lib/utils';

const HashGenerator = () => {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('bcrypt');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateHash = async () => {
    if (!password) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password to hash.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(async () => {
        let newHash = '';

        switch (algorithm) {
          case 'bcrypt':
            const salt = await bcrypt.genSalt(rounds);
            newHash = await bcrypt.hash(password, salt);
            break;
          case 'sha256':
            newHash = await shaHash(password, 'SHA-256');
            break;
          case 'sha512':
            newHash = await shaHash(password, 'SHA-512');
            break;
          default:
            newHash = 'Unsupported algorithm';
        }

        setHash(newHash);
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error generating hash:', error);
      toast({
        title: 'Hashing Error',
        description: 'Failed to generate hash. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!hash) return;

    navigator.clipboard
      .writeText(hash)
      .then(() => {
        toast({
          title: 'Copied!',
          description: 'Hash copied to clipboard',
        });
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy hash to clipboard',
          variant: 'destructive',
        });
      });
  };

  const handleRoundsChange = (value: number[]) => {
    setRounds(value[0]);
  };

  const handleInputRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 4 && value <= 15) {
      setRounds(value);
    }
  };

  const showRoundsControl = algorithm === 'bcrypt';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="algorithm" className="text-sm font-medium">
          Hash Algorithm
        </Label>
        <Select
          value={algorithm}
          onValueChange={(value) => setAlgorithm(value as HashAlgorithm)}
        >
          <SelectTrigger className="border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-slate-800/80">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bcrypt">Bcrypt</SelectItem>
            <SelectItem value="sha256">SHA-256</SelectItem>
            <SelectItem value="sha512">SHA-512</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type="text"
            placeholder="Enter password to hash"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-slate-800/80"
          />
        </div>
      </div>

      {showRoundsControl && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="rounds" className="text-sm font-medium">
              Cost Rounds
            </Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Higher = more secure, but slower
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Slider
                id="rounds"
                min={4}
                max={15}
                step={1}
                value={[rounds]}
                onValueChange={handleRoundsChange}
                className="py-2"
              />
            </div>
            <div className="w-16">
              <Input
                type="number"
                min={4}
                max={15}
                value={rounds}
                onChange={handleInputRoundsChange}
                className="text-center bg-white/80 dark:bg-slate-800/80"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
            <span>Fast (4)</span>
            <span>Balanced (10)</span>
            <span>Secure (15)</span>
          </div>
        </div>
      )}

      <Button
        onClick={generateHash}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-medium py-2"
        disabled={isLoading || !password}
      >
        {isLoading ? (
          <>
            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Hash'
        )}
      </Button>

      {hash && (
        <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Label htmlFor="generated-hash" className="text-sm font-medium">
            Generated Hash
          </Label>
          <div className="relative">
            <Input
              id="generated-hash"
              value={hash}
              readOnly
              className="pr-10 font-mono text-sm border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full aspect-square"
              onClick={copyToClipboard}
            >
              <CopyIcon className="h-4 w-4" />
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {algorithm === 'bcrypt'
              ? 'This hash contains the salt, cost factor, and password hash in one string.'
              : 'This is a one-way hash. For password storage, bcrypt is recommended ( SHA algorithms are too fast and insecure for passwords. They are vulnerable to brute-force and rainbow table attacks).'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HashGenerator;
