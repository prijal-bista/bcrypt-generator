import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  CheckCircleIcon,
  KeyIcon,
  LoaderCircleIcon,
  ShieldIcon,
  XCircleIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import bcrypt from 'bcryptjs';
import { shaHash } from '@/lib/utils';

const HashVerifier = () => {
  const [plaintext, setPlaintext] = useState('');
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('bcrypt');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyPassword = async () => {
    if (!plaintext || !hash) {
      toast({
        title: 'Information Required',
        description: 'Please enter both the password and hash to verify.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      // Use setTimeout to allow UI to update before the CPU-intensive comparison operation
      setTimeout(async () => {
        let isMatch = false;

        switch (algorithm) {
          case 'bcrypt':
            isMatch = await bcrypt.compare(plaintext, hash);
            break;
          case 'sha256': {
            const generatedHash = await shaHash(plaintext, 'SHA-256');
            isMatch = generatedHash === hash;
            break;
          }
          case 'sha512': {
            const generatedHash = await shaHash(plaintext, 'SHA-512');
            isMatch = generatedHash === hash;
            break;
          }

          default:
            isMatch = false;
        }

        setVerificationResult(isMatch);
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error verifying hash:', error);
      toast({
        title: 'Verification Error',
        description:
          'Failed to verify. The hash might be invalid or corrupted.',
        variant: 'destructive',
      });
      setVerificationResult(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="verify-algorithm" className="text-sm font-medium">
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
        <Label htmlFor="plaintext" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="plaintext"
            type="text"
            placeholder="Enter the password to verify"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            className="pl-10 border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-slate-800/80"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hash" className="text-sm font-medium">
          Hash
        </Label>
        <div className="relative">
          <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="hash"
            type="text"
            placeholder={`Enter the ${algorithm} hash to compare against`}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="pl-10 font-mono text-sm border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-slate-800/80"
          />
        </div>
      </div>

      <Button
        onClick={verifyPassword}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-medium py-2"
        disabled={isLoading || !plaintext || !hash}
      >
        {isLoading ? (
          <>
            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Password'
        )}
      </Button>

      {verificationResult !== null && (
        <div
          className={`mt-6 p-4 rounded-md flex items-center gap-3 backdrop-blur-sm ${
            verificationResult
              ? 'bg-green-50/80 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200/50 dark:border-green-800/50'
              : 'bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200/50 dark:border-red-800/50'
          }`}
        >
          {verificationResult ? (
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
          ) : (
            <XCircleIcon className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="font-medium">
            {verificationResult
              ? 'Match! The password is correct.'
              : 'No match! The password does not match the hash.'}
          </span>
        </div>
      )}
    </div>
  );
};

export default HashVerifier;
