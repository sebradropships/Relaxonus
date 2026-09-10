import Script from "next/script";

import { PIXEL_READY_EVENT } from "@/lib/meta-pixel";

const META_PIXEL_ID = "1082533454743448";

/* Meta's standard base code, unchanged apart from the id and a last line
   announcing that fbq now exists, which releases any commerce event raised
   before it (lib/meta-pixel.ts). afterInteractive injects it client-side once
   hydration is underway, so it is never part of the server HTML and cannot
   cause a hydration mismatch. The `id` lets next/script run it exactly once,
   even when Strict Mode mounts the layout twice in development — otherwise
   PageView would be counted twice. */
export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
window.dispatchEvent(new Event('${PIXEL_READY_EVENT}'));`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
