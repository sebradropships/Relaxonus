import { CAPI_PATH, META_PIXEL_ID, PIXEL_READY_EVENT } from "@/lib/meta-pixel";

/* Meta's standard base code, emitted INLINE in the server HTML.
 *
 * It used to load through next/script with strategy="afterInteractive", which
 * injects it client-side only once hydration is underway. On mobile that is
 * seconds after the click, and anyone who left before then was never counted:
 * PageView never fired, so Meta logged no Landing Page View. Between 11–20 Sep
 * that lost 64% of Relaxonus link clicks and 83% of Hoygi's — which both hid
 * real traffic and starved the optimiser of the signal it bids on, feeding
 * straight back into a CA$62+ CPM.
 *
 * Inline in the document means the browser parses and runs this during parse,
 * before React hydrates and before the first paint of anything below it. That
 * is the whole point: PageView must not wait for JavaScript we control.
 *
 * Idempotency: the `__relaxonusPixelInit` flag guards the whole block, not just
 * the initialiser. Meta's own `if(f.fbq)return;` protects fbq from being rebuilt
 * but would still let a second execution fire a duplicate PageView.
 *
 * PageView also goes to the Conversions API relay (lib/meta-pixel.ts has the
 * same pair for every other event), beaconed during parse under the pixel's
 * event id. fbq only queues PageView until fbevents.js has downloaded from
 * Facebook; the beacon goes to our own origin at once, so a visitor who leaves
 * during that download, or blocks facebook.com, still reaches Meta. The
 * wrapper function keeps the id out of the global scope.
 *
 * Safe to inline: every value interpolated here is a module constant, never
 * user input, so there is nothing to escape.
 */
const BASE_CODE = `if(!window.__relaxonusPixelInit){window.__relaxonusPixelInit=1;(function(){
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
var id=window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
fbq('track', 'PageView', {}, {eventID: id});
try{var body=JSON.stringify({event_name:'PageView',event_id:id,event_source_url:location.href});
if(!(navigator.sendBeacon&&navigator.sendBeacon('${CAPI_PATH}',body)))fetch('${CAPI_PATH}',{method:'POST',body:body,keepalive:true}).catch(function(){});}catch(x){}
window.dispatchEvent(new Event('${PIXEL_READY_EVENT}'));})();}`;

export function MetaPixel() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: BASE_CODE }} />
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
