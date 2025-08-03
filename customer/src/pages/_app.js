import "@styles/custom.css";
import "@styles/responsive.css";
import { CartProvider } from "react-use-cart";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
// import { SessionProvider } from "next-auth/react"; // Removed NextAuth SessionProvider
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import Head from "next/head";
import dynamic from "next/dynamic";

// Internal imports
import store from "@redux/store";
import { handlePageView } from "@lib/analytics";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@components/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import SettingServices from "@services/SettingServices";
import PageLoader from "@components/preloader/PageLoader";

let persistor = persistStore(store);

// Dynamically import TawkMessengerReact to prevent SSR issues
const DynamicTawkMessenger = dynamic(
  () => import("@tawk.to/tawk-messenger-react"),
  { ssr: false }
);

// Optimized React Query configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [storeSetting, setStoreSetting] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHydrated(true);
    }
  }, []);

  // Memoized route handlers for better performance
  const handleRouteStart = useCallback(() => {
    setIsPageLoading(true);
  }, []);

  const handleRouteComplete = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  const handleRouteError = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const settings = await SettingServices.getStoreSetting();
        setStoreSetting(settings);
        setIsInitialized(true);
        setIsAppLoading(false);

        // Initialize Google Analytics only once and only on client
        if (isHydrated && settings?.google_analytic_status && !window.gtag) {
          ReactGA.initialize(settings?.google_analytic_key || "");
          handlePageView();
        }
      } catch (error) {
        console.error("Failed to fetch store settings:", error);
        setIsInitialized(true);
        setIsAppLoading(false);
      }
    };

    if (isHydrated) {
      fetchStoreSettings();
    }
  }, [isHydrated]);

  // Optimized route event handlers
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteError);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteError);
    };
  }, [router, handleRouteStart, handleRouteComplete, handleRouteError]);

  // Sync <html> lang and dir on locale change - force English/Arabic only
  useEffect(() => {
    if (isHydrated) {
      // Force only English or Arabic, ignore browser locale
      const currentLocale = ['en', 'ar'].includes(router.locale) ? router.locale : 'en';
      document.documentElement.lang = currentLocale;
      document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
      
      // Ensure cookies are set correctly
      const Cookies = require('js-cookie');
      if (!Cookies.get('_lang') || !['en', 'ar'].includes(Cookies.get('_lang'))) {
        Cookies.set('_lang', currentLocale, { expires: 365 });
        Cookies.set('NEXT_LOCALE', currentLocale, { expires: 365 });
      }
    }
  }, [router.locale, isHydrated]);

  // Show loading during initial app load
  if (isAppLoading || !isHydrated) {
    return <PageLoader />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {/* Removed SessionProvider - using custom auth instead */}
          <UserProvider>
            <Provider store={store}>
              <PersistGate loading={<PageLoader />} persistor={persistor}>
                <SidebarProvider>
                  <CartProvider>
                    <DefaultSeo />
                    {/* Show page loader during route transitions */}
                    {isPageLoading && <PageLoader />}
                    {/* Render TawkMessengerReact only if initialized and enabled (client-side only) */}
                    {isInitialized && storeSetting?.tawk_chat_status && isHydrated && (
                      <DynamicTawkMessenger
                        propertyId={storeSetting?.tawk_chat_property_id || ""}
                        widgetId={storeSetting?.tawk_chat_widget_id || ""}
                      />
                    )}
                    <Component {...pageProps} />
                  </CartProvider>
                </SidebarProvider>
              </PersistGate>
            </Provider>
          </UserProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
