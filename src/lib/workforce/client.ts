// Browser helpers for the workforce pages.

/**
 * Generic Workforce API helper.
 */
export async function api<T = any>(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
  }
): Promise<T> {
  const r = await fetch("/api/workforce" + path, {
  cache: "no-store",
    method: init?.method ?? (init?.body ? "POST" : "GET"),
    headers: init?.body
      ? {
          "content-type": "application/json",
        }
      : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
  });

  const j = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw Object.assign(
      new Error(j.error ?? "Request failed"),
      {
        status: r.status,
      }
    );
  }

  return j;
}

/**
 * Get the best available browser GPS position.
 *
 * The browser may occasionally return a temporary geolocation error even
 * when permission is granted. We therefore keep listening for GPS updates
 * and select the most accurate successful position we receive.
 *
 * The server remains responsible for deciding whether the employee is
 * actually inside the office geofence.
 */
export async function getPosition(): Promise<GeolocationPosition> {
  if (typeof navigator === "undefined") {
    throw new Error("Location is not available on the server.");
  }

  if (!navigator.geolocation) {
    throw new Error(
      "Location is not supported by this browser."
    );
  }

  /*
   * Check browser permission state.
   *
   * This is diagnostic only. The server still makes the final
   * attendance/geofence decision.
   */
  let permissionState: PermissionState | "unknown" = "unknown";

  try {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      permissionState = permission.state;

      console.log(
        "[Workforce GPS] Browser permission:",
        permission.state
      );
    }
  } catch {
    console.log(
      "[Workforce GPS] Browser permission state unavailable."
    );
  }

  /*
   * If Chrome explicitly reports that the site is denied,
   * don't start a GPS watch.
   */
  if (permissionState === "denied") {
    throw new Error(
      "Chrome has blocked location access for localhost:3000. " +
        "Open Site settings and set Location to Allow."
    );
  }

  return new Promise<GeolocationPosition>((resolve, reject) => {
    let watchId: number | null = null;
    let finished = false;
    let bestPosition: GeolocationPosition | null = null;

    /*
     * Maximum amount of time we allow the browser to search
     * for a useful GPS position.
     */
    const MAX_WAIT_MS = 30000;

    /*
     * Target accuracy.
     *
     * Once Chrome gives us a position at or below this value,
     * we immediately use it.
     */
    const TARGET_ACCURACY_M = 100;

    let timeoutId: number;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };

    const finishWithPosition = (
      position: GeolocationPosition
    ) => {
      if (finished) return;

      finished = true;
      cleanup();

      console.log(
        "[Workforce GPS] Final position selected:",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }
      );

      resolve(position);
    };

    const finishWithError = (
      error: GeolocationPositionError | Error
    ) => {
      if (finished) return;

      finished = true;
      cleanup();

      console.error(
        "[Workforce GPS] Final GPS error:",
        error
      );

      if ("code" in error) {
        if (error.code === 1) {
          reject(
            new Error(
              "Chrome could not provide a usable location fix. " +
                "Location permission is currently " +
                (permissionState === "granted"
                  ? "granted, but the location provider returned a temporary error."
                  : "not available.")
            )
          );
          return;
        }

        if (error.code === 2) {
          reject(
            new Error(
              "Your device could not determine a location. " +
                "Make sure Windows Location Services and Wi-Fi location are enabled."
            )
          );
          return;
        }

        if (error.code === 3) {
          reject(
            new Error(
              "Location detection timed out. " +
                "Move near a window or enable Wi-Fi location and try again."
            )
          );
          return;
        }
      }

      reject(
        error instanceof Error
          ? error
          : new Error("Unable to obtain your current location.")
      );
    };

    /*
     * Give Chrome up to 30 seconds to obtain a useful position.
     */
    timeoutId = window.setTimeout(() => {
      console.warn(
        "[Workforce GPS] 30 second GPS collection window finished."
      );

      /*
       * If we have any successful GPS reading, use the most
       * accurate one we received.
       */
      if (bestPosition) {
        finishWithPosition(bestPosition);
        return;
      }

      finishWithError(
        new Error(
          "Unable to obtain a GPS position within 30 seconds."
        )
      );
    }, MAX_WAIT_MS);

    /*
     * watchPosition is intentional here.
     *
     * Instead of taking only one GPS reading, we allow the browser
     * to improve the accuracy over several readings.
     */
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = position.coords.accuracy;

        console.log(
          "[Workforce GPS] GPS fix:",
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy,
            timestamp: position.timestamp,
          }
        );

        /*
         * Keep whichever successful position has the smallest
         * accuracy value.
         */
        if (
          !bestPosition ||
          accuracy < bestPosition.coords.accuracy
        ) {
          bestPosition = position;

          console.log(
            "[Workforce GPS] New best accuracy:",
            accuracy,
            "meters"
          );
        }

        /*
         * If the browser gives us a position accurate enough
         * for the server's current 100m requirement, use it.
         */
        if (accuracy <= TARGET_ACCURACY_M) {
          console.log(
            "[Workforce GPS] Target accuracy reached:",
            accuracy,
            "meters"
          );

          finishWithPosition(position);
        }
      },
      (error) => {
        console.warn(
          "[Workforce GPS] GPS provider error:",
          {
            code: error.code,
            message: error.message,
          }
        );

        /*
         * IMPORTANT:
         *
         * Chrome has already demonstrated in your testing that
         * it can report "User denied Geolocation" and subsequently
         * provide a successful GPS position.
         *
         * Therefore, when permission is actually "granted", we
         * don't immediately terminate the GPS collection.
         */
        if (
          error.code === 1 &&
          permissionState === "granted"
        ) {
          console.warn(
            "[Workforce GPS] Permission is granted. " +
              "Ignoring transient provider error and continuing GPS collection."
          );

          return;
        }

        /*
         * Position unavailable.
         *
         * Keep waiting because the browser may recover.
         */
        if (error.code === 2) {
          console.warn(
            "[Workforce GPS] Position unavailable. " +
              "Continuing to wait for another GPS fix."
          );

          return;
        }

        /*
         * Timeout from an individual GPS attempt.
         *
         * Keep waiting until the overall 30-second window expires.
         */
        if (error.code === 3) {
          console.warn(
            "[Workforce GPS] Individual GPS request timed out. " +
              "Continuing to wait."
          );

          return;
        }

        /*
         * If we already have a successful position and receive
         * another unexpected error, use the best position collected.
         */
        if (bestPosition) {
          finishWithPosition(bestPosition);
          return;
        }

        finishWithError(error);
      },
      {
        enableHighAccuracy: true,

        /*
         * Timeout for an individual GPS provider request.
         * The overall collection window is 30 seconds.
         */
        timeout: 10000,

        /*
         * Always request a fresh position.
         */
        maximumAge: 0,
      }
    );
  });
}