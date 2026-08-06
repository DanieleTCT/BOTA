import { useEffect } from 'react';
import type { SeoConfig, CodeInjectionConfig } from '@/types';

export function useSeoAndCodeInjection(seo: SeoConfig, code: CodeInjectionConfig) {
  useEffect(() => {
    if (seo.pageTitle) document.title = seo.pageTitle;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (seo.metaDescription) setMeta('description', seo.metaDescription);
    if (seo.ogImageUrl) {
      setMeta('og:image', seo.ogImageUrl, 'property');
      setMeta('twitter:image', seo.ogImageUrl);
    }
  }, [seo]);

  useEffect(() => {
    const id = 'ga-script';
    document.getElementById(id)?.remove();
    if (code.googleAnalyticsId) {
      const script = document.createElement('script');
      script.id = id;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${code.googleAnalyticsId}`;
      document.head.appendChild(script);
      const inline = document.createElement('script');
      inline.id = id + '-inline';
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${code.googleAnalyticsId}');
      `;
      document.head.appendChild(inline);
    }
    return () => {
      document.getElementById(id)?.remove();
      document.getElementById(id + '-inline')?.remove();
    };
  }, [code.googleAnalyticsId]);

  useEffect(() => {
    const id = 'custom-head-scripts';
    document.getElementById(id)?.remove();
    if (code.customHeadScripts) {
      const el = document.createElement('script');
      el.id = id;
      el.innerHTML = code.customHeadScripts;
      document.head.appendChild(el);
    }
    return () => document.getElementById(id)?.remove();
  }, [code.customHeadScripts]);

  useEffect(() => {
    const id = 'custom-body-scripts';
    document.getElementById(id)?.remove();
    if (code.customBodyScripts) {
      const el = document.createElement('script');
      el.id = id;
      el.innerHTML = code.customBodyScripts;
      document.body.appendChild(el);
    }
    return () => document.getElementById(id)?.remove();
  }, [code.customBodyScripts]);
}
