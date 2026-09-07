"use client";

import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = "w-5 h-5",
  size,
  ...props
}) => {
  // @ts-expect-error - dynamic lucide lookup
  const IconComponent = Icons[name] || Icons.FileText;
  return <IconComponent className={className} size={size} {...props} />;
};
