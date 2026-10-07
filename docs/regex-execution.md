# Regex execution boundary

RegexTool never calls the synchronous engine during render, presentation or its
event handlers. It sends pattern, flags, input and maximum matches to a fresh
bundled same-origin module Worker. The worker imports the shared regex engine and
uses the RegExp constructor. User strings are message data, not generated code.
The synchronous testRegex export remains for worker execution and utility tests;
it is not safe to call on the UI thread with untrusted patterns.

RegexTaskRunner starts a 1000 ms deadline and terminates the worker on success,
error, cancellation or timeout. There is no synchronous fallback when workers
cannot start. Pattern, input and flag changes cancel the old worker immediately;
an active-task identity guard plus the component's version guard discard late
results. Unmount cancels pending work. Repeating Load Sample with unchanged input
does not cancel its active task without replacement.

The deadline includes worker startup and message handling. Timers are scheduled
by the browser, so background-tab throttling or system load can delay delivery;
the expensive regex remains off the UI thread even then. A slow device may reject
an otherwise valid expensive pattern. The UI suggests simplifying it or shortening
input and announces loading/results/errors through a live status region.

Default visible pattern: user_id_(\d+), flags g. No forced global flag: without g,
only the first match is returned. With g, matches are collected up to the cap.
Existing i/m/s/u semantics are retained and y is exposed as the native sticky flag.
An internal d flag is used for capture ranges when supported, with a native fallback.
Unsupported/duplicate flags return an error. Empty pattern shows an instruction;
empty input is evaluated normally (for example ^$ produces one zero-length match).

Global zero-length matches advance lastIndex by a Unicode code point in u mode,
otherwise by one UTF-16 code unit. Results include start/end/fullMatch and capture
values/ranges. React renders range slices as text, never injected/replacement HTML.

Limits:
- Input: 1,000,000 UTF-16 code units.
- Pattern: 10,000 UTF-16 code units.
- Matches: at most 500 (caller can request fewer).
- Captures: at most 2,000 total.
- Full-match plus capture value text: at most 1,000,000 code units.

Input/pattern over the limit is rejected, never silently truncated. Reaching a
result budget marks the response as limited. To avoid a further costly exec,
reaching exactly the match cap also says additional matches *may* exist.
Results and reports share the same state object; rendering does not rerun regex.

The current CSP already permits the same-origin worker bundle through its existing
directives. No CSP changes, blob-worker scripts or eval are required.

Tests use a Node worker_threads transport adapter around the actual browser worker
entry, not a separate regex implementation. They verify a live main-thread heartbeat
while the catastrophic worker runs, timeout termination, subsequent successful work,
late-message rejection and lifecycle cleanup. Browser checks exercise the actual
Next.js production worker bundle separately.
