// Service Worker registration script
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );

        // Check if there's a waiting service worker
        if (registration.waiting) {
          // New service worker is waiting to activate
          notifyUpdateReady(registration);
        }

        // Handle updates during the page session
        registration.addEventListener("updatefound", function () {
          // A new service worker is being installed
          const installingWorker = registration.installing;

          installingWorker.addEventListener("statechange", function () {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker is installed but waiting for activation
              notifyUpdateReady(registration);
            }
          });
        });
      })
      .catch(function (error) {
        // Registration failed
        console.log("ServiceWorker registration failed: ", error);
      });

    // Detect controller change and reload page
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// Function to notify the user about an update and prompt for reload
function notifyUpdateReady(registration) {
  // You can implement a UI notification here
  console.log("New version available! Ready to update.");

  // Example: Automatically apply update after 10 minutes if user doesn't manually update
  setTimeout(
    () => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    },
    10 * 60 * 1000
  ); // 10 minutes
}

// Add event listener for offline/online status changes
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

function updateOnlineStatus() {
  const statusElement = document.getElementById("connection-status");
  if (!statusElement) return;

  if (navigator.onLine) {
    statusElement.textContent = "Online";
    statusElement.classList.remove("offline");
    statusElement.classList.add("online");
  } else {
    statusElement.textContent = "Offline";
    statusElement.classList.remove("online");
    statusElement.classList.add("offline");
  }
}
