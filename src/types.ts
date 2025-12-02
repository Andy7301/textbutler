// Type definitions for LLM analysis response
export interface MessageAnalysis {
  priority: 'low' | 'medium' | 'high';
  vibe: string;
  tldr: string;
  suggested_reply: string;
  should_notify: boolean;
}

