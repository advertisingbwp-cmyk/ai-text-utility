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

  const ready = (props.resultReady ?? props.output !== "") && !props.error && !props.isLoading;
  const currentProps = { ...props, resultReady: !!ready, output: ready ? props.output : "",
    customPreview: ready || (!props.output && !props.isLoading && !props.error) ? props.customPreview : undefined };
  const renderLayout = () => {
    switch (tool.layout) {
      case "transform":
        return <TransformLayout {...currentProps} />;
      case "generator":
        return <GeneratorLayout {...currentProps} />;
      case "dashboard":
        return <DashboardLayout {...currentProps} />;
      case "table":
        return <TableLayout {...currentProps} />;
      case "twoWay":
        return <TwoWayLayout {...currentProps} />;
      case "validator":
        return <ValidatorLayout {...currentProps} />;
      case "highlight":
        return <HighlightLayout {...currentProps} />;
      case "splitPreview":
        return <SplitPreviewLayout {...currentProps} />;
      case "gallery":
        return <GalleryLayout {...currentProps} />;
      case "compact":
        return <CompactLayout {...currentProps} />;
      case "ai":
        return <AILayout {...currentProps} />;
      default:
        return <TransformLayout {...currentProps} />;
    }
  };

  return (
    <ToolShell
      tool={tool}
      error={error}
      onClear={onClear}
      onRun={props.isLoading ? undefined : onRun}
      headerExtra={headerExtra}
    >
      {props.resultReady && !props.output && !error && !props.isLoading && (
        <p role="status" className="text-sm text-slate-500">Completed: the result is empty.</p>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{props.isLoading ? "Processing. Please wait." : ready ? "Result ready." : ""}</p>
      {renderLayout()}
    </ToolShell>
  );
};
