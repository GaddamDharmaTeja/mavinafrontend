import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTOR = ".reveal-left, .reveal-right, .reveal-center";

const ScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    let observer = null;
    let mutationObserver = null;
    const observed = new WeakSet();

    const ensureObserver = () => {
      if (observer) {
        return observer;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
            } else {
              entry.target.classList.remove("show");
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      return observer;
    };

    const observeElements = () => {
      const io = ensureObserver();

      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (observed.has(element)) {
          return;
        }

        observed.add(element);
        io.observe(element);
      });
    };

    /*
     * Wait until the current route's DOM is rendered,
     * then watch for dynamically added reveal targets (e.g. API products).
     */
    const timer = setTimeout(() => {
      observeElements();

      mutationObserver = new MutationObserver(() => {
        observeElements();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 100);

    return () => {
      clearTimeout(timer);

      if (mutationObserver) {
        mutationObserver.disconnect();
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  return null;
};

export default ScrollReveal;
