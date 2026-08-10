import { useEffect } from "react";

const PIXEL_DELAY = 5000;

const DeferredPixels = () => {
  useEffect(() => {
    let loaded = false;
    let timer = 0;

    const loadPixels = () => {
      if (loaded) return;
      loaded = true;

      const bootstrap = document.createElement("script");
      bootstrap.text = `
        !function(w,d,t){w.TiktokAnalyticsObject=t;var q=w[t]=w[t]||[];
        q.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        q.setAndDefer=function(o,n){o[n]=function(){o.push([n].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<q.methods.length;i++)q.setAndDefer(q,q.methods[i]);
        q.load=function(id){var s=d.createElement("script");s.async=true;s.src="https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+id+"&lib="+t;
        var f=d.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f)};
        q.load("D85GO0JC77U70JIQNGG0");q.page()}(window,document,"ttq");

        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=true;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
        fbq("init","1230746282530411");fbq("track","PageView");
      `;
      document.head.appendChild(bootstrap);
    };

    const schedule = () => {
      timer = window.setTimeout(loadPixels, PIXEL_DELAY);
      window.addEventListener("pointerdown", loadPixels, { once: true, passive: true, capture: true });
      window.addEventListener("keydown", loadPixels, { once: true, capture: true });
      window.addEventListener("scroll", loadPixels, { once: true, passive: true });
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      window.removeEventListener("pointerdown", loadPixels, true);
      window.removeEventListener("keydown", loadPixels, true);
      window.removeEventListener("scroll", loadPixels);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
};

export default DeferredPixels;
