import React from "react";
import { ToolDefinition } from "@/data/toolsRegistry";

export interface WorkspaceProps {
  tool: ToolDefinition;
  input: string;
  output: string;
  onInputChange: (val: string) => void;
  onRun?: () => void;
  onClear?: () => void;
  onSwap?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
  error?: string | null;
  canSwap?: boolean;
  canDownload?: boolean;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  customControls?: React.ReactNode;
  customPreview?: React.ReactNode;
  customWorkspace?: React.ReactNode;
  customData?: unknown;
}
