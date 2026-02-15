'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface CallTranscriptProps {
  transcript: string | null;
  callSid?: string;
}

export function CallTranscript({ transcript, callSid }: CallTranscriptProps) {
  const [expanded, setExpanded] = useState(false);

  if (!transcript) {
    return <span className="text-muted-foreground text-sm italic">No transcript</span>;
  }

  const lines = transcript.split('\n').filter(Boolean);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <ChevronRight className={cn('w-4 h-4 transition-transform duration-200', expanded && 'rotate-90')} />
        {expanded ? 'Hide transcript' : `View transcript (${lines.length} messages)`}
      </button>

      {expanded && (
        <div className="rounded-2xl bg-muted/30 dark:bg-muted/20 p-4 space-y-2 max-h-80 overflow-y-auto text-sm animate-fade-in">
          {callSid && (
            <p className="text-xs text-muted-foreground font-mono mb-2">
              Call SID: {callSid}
            </p>
          )}
          {lines.map((line, i) => {
            const isAssistant = line.startsWith('Assistant:');
            const isPatient = line.startsWith('Patient:');
            const content = line.replace(/^(Assistant|Patient):\s*/, '');

            return (
              <div
                key={i}
                className={cn(
                  'rounded-2xl px-3 py-2',
                  isAssistant && 'bg-muted/50 dark:bg-muted/40 text-foreground ml-4',
                  isPatient && 'bg-primary/5 dark:bg-primary/10 text-foreground mr-4',
                  !isAssistant && !isPatient && 'text-muted-foreground'
                )}
              >
                {(isAssistant || isPatient) && (
                  <span className="text-xs font-semibold text-muted-foreground block mb-0.5">
                    {isAssistant ? 'AI Assistant' : 'Patient'}
                  </span>
                )}
                <span>{content}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
