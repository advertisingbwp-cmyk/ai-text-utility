# AI rate limiting

The server reads AI_RATE_LIMIT_PER_IP_MINUTE and Upstash credentials once at module
initialization. getAiRateLimiter() returns the same active instance for that runtime.
Environment changes require a new runtime/redeployment. Invalid, zero or negative
configured limits use the default of 15 requests per minute.

With both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set, Redis is the
authoritative distributed limiter. Each request makes one bounded Redis attempt
(default timeout 1500 ms). The existing fixed-window INCR counter is atomic; its
INCR/EXPIRE HTTP pipeline is not a transaction. No GET/modify/SET race is introduced.

Network, timeout, HTTP and invalid Redis responses use the same persistent local
sliding-window fallback. Its synchronous check/update has no await between reading
and storing a counter, so concurrent failures cannot reset or interleave that update
within one JavaScript runtime. Redis is attempted on every subsequent request:
recovery needs no restart and there is no background or aggressive retry loop.
Warnings omit raw errors and credentials and are limited to one per minute per
limiter instance.

**The fallback is runtime-local only.** It cannot enforce a global quota across
multiple Vercel instances, cold starts, regions or restarts. It is a temporary safety
layer, not a replacement for Redis. Redis and local counts are not synchronized:
switching between modes can allow additional requests within an interval. An
ambiguous Redis timeout may also mean Redis counted a request before local fallback.

Without Redis credentials, the active limiter is the persistent local singleton.
The remaining count never goes below zero. Reset denotes the earliest next local
slot (sliding window) or next Redis bucket (fixed window); it does not promise that
the entire sliding-window quota resets at that instant. Successful AI responses
and limiter-generated 429 responses include limit, remaining and reset headers.
Only 429 responses include Retry-After.

IP extraction keeps the existing priority: x-vercel-forwarded-for, x-real-ip,
then the first x-forwarded-for address. A valid Vercel header takes precedence over
conflicting generic headers. Vercel documents its edge headers and spoofing protection:
https://vercel.com/docs/headers/request-headers

Outside Vercel, forwarded headers are trustworthy only if the deployment's trusted
reverse proxy strips/replaces client-supplied values and direct origin access is
restricted. This phase does not add a general proxy trust configuration or
fingerprinting. Missing valid headers share the existing localhost fallback.

Upstash pipeline semantics:
https://upstash.com/docs/redis/features/restapi#pipelining
