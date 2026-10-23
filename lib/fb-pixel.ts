// Facebook (Meta) Pixel. It only runs when NEXT_PUBLIC_FB_PIXEL_ID is set in Vercel, so the page
// works the same without it.
// Pixel IDs are digits only; anything else is dropped so it can't end up inside the script.
export const FB_PIXEL_ID = (process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "").replace(/\D/g, "")

type Fbq = (...args: unknown[]) => void

export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const fbq = (window as unknown as { fbq?: Fbq }).fbq
  if (fbq) fbq("track", event, params)
}
