/**
 * Privacy-First Analytics Abstraction
 * Tracks user interaction telemetry (e.g. tool usage, favorites, copies)
 * WITHOUT collecting or transmitting user text, private payloads, or sensitive data.
 */

export type AnalyticsEventType =
  | "tool_opened"
  | "tool_used"
  | "tool_copied"
  | "favorite_added"
  | "ai_tool_used";

export interface AnalyticsEventData {
  toolSlug: string;
  category?: string;
  action?: string;
  durationMs?: number;
  inputLength?: number; // Count only, NEVER the text content!
  outputLength?: number;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEventType, data: AnalyticsEventData): void;
}

/**
 * Standard console/noop provider for local development or when external analytics are disabled.
 */
class LocalAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEventType, data: AnalyticsEventData): void {
    if (process.env.NODE_ENV === "development") {
      // Safe telemetry debug log
      // console.debug(`[Analytics] ${event}:`, data);
    }
  }
}

/**
 * Pluggable Google Analytics / Custom Script adapter
 */
class WindowAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEventType, data: AnalyticsEventData): void {
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", event, {
          tool_slug: data.toolSlug,
          category: data.category,
          action: data.action,
          input_char_count: data.inputLength,
          output_char_count: data.outputLength,
        });
      }
    } catch {
      // Silently ignore telemetry transmission errors
    }
  }
}

let activeProvider: AnalyticsProvider =
  typeof window !== "undefined" && window.gtag
    ? new WindowAnalyticsProvider()
    : new LocalAnalyticsProvider();

/**
 * Configure or replace active analytics provider at runtime.
 */
export function setAnalyticsProvider(provider: AnalyticsProvider): void {
  activeProvider = provider;
}

/**
 * Dispatches an analytics event safely without sending user text.
 */
export function trackEvent(
  event: AnalyticsEventType,
  data: AnalyticsEventData
): void {
  // Safety guard: ensure no raw text properties accidentally leak
  const sanitizedData: AnalyticsEventData = {
    toolSlug: data.toolSlug,
    category: data.category,
    action: data.action,
    durationMs: data.durationMs,
    inputLength: typeof data.inputLength === "number" ? data.inputLength : undefined,
    outputLength: typeof data.outputLength === "number" ? data.outputLength : undefined,
  };

  activeProvider.track(event, sanitizedData);
}
