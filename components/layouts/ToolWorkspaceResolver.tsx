"use client";

import React from "react";
import { ToolShell } from "./ToolShell";
import { WorkspaceProps } from "./types";
import { TransformLayout } from "./TransformLayout";
import { GeneratorLayout } from "./GeneratorLayout";
import { DashboardLayout } from "./DashboardLayout";
import { TableLayout } from "./TableLayout";
import { TwoWayLayout } from "./TwoWayLayout";
import { ValidatorLayout } from "./ValidatorLayout";
import { HighlightLayout } from "./HighlightLayout";
import { SplitPreviewLayout } from "./SplitPreviewLayout";
import { GalleryLayout } from "./GalleryLayout";
import { CompactLayout } from "./CompactLayout";
import { AILayout } from "./AILayout";

export interface ToolWorkspaceResolverProps extends WorkspaceProps {
  headerExtra?: React.ReactNode;
}

export const ToolWorkspaceResolver: React.FC<ToolWorkspaceResolverProps> = (props) => {
  const { tool, error, onClear, onRun, headerExtra } = props;

  const renderLayout = () => {
    switch (tool.layout) {
      case "transform":
        return <TransformLayout {...props} />;
      case "generator":
        return <GeneratorLayout {...props} />;
      case "dashboard":
        return <DashboardLayout {...props} />;
      case "table":
        return <TableLayout {...props} />;
      case "twoWay":
        return <TwoWayLayout {...props} />;
      case "validator":
        return <ValidatorLayout {...props} />;
      case "highlight":
        return <HighlightLayout {...props} />;
      case "splitPreview":
        return <SplitPreviewLayout {...props} />;
      case "gallery":
        return <GalleryLayout {...props} />;
      case "compact":
        return <CompactLayout {...props} />;
      case "ai":
        return <AILayout {...props} />;
      default:
        return <TransformLayout {...props} />;
    }
  };

  return (
    <ToolShell
      tool={tool}
      error={error}
      onClear={onClear}
      onRun={onRun}
      headerExtra={headerExtra}
    >
      {renderLayout()}
    </ToolShell>
  );
};
