import React from "react";

export const AD_SANDBOX = "allow-scripts allow-popups";

export function AdsterraFrame({ title, width, height, document, className = "" }: {
  title: string; width: number | string; height: number; document: string; className?: string;
}) {
  return <iframe title={title} width={width} height={height}
    sandbox={AD_SANDBOX} referrerPolicy="no-referrer" srcDoc={document}
    frameBorder="0" className={className} style={{ height, flexShrink: 0 }} />;
}

// Only static provider configuration belongs in these documents; never pass tool text.
export function bannerDocument(key: string, width: number, height: number) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>
<script>var atOptions={key:${JSON.stringify(key)},format:"iframe",height:${height},width:${width},params:{}};</script>
<script src="https://www.highrevenueformat.com/${key}/invoke.js"></script></body></html>`;
}

export const nativeDocument = `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer">
<style>html,body{margin:0;padding:0;background:transparent}</style></head><body>
<div id="container-8aca604b8b2ab0a3b2106d4958e02b1d"></div>
<script async data-cfasync="false" src="https://pl31247526.profitableratecpmnetwork.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js"></script>
</body></html>`;
