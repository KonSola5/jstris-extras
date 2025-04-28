// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export function getPlayerName(callback: (name: string, loggedIn: boolean) => void) {
  fetch("https://jstris.jezevec10.com/profile")
    .then((res) => {
      if (res.url.includes("/u/")) {
        const username = res.url.substring(res.url.indexOf("/u/") + 3);
        callback(username, true);
      } else {
        callback("", false);
      }
    })
    .catch((e) => {
      console.log(e);
      callback("", false);
    });
}

let notificationsSupported = false;

export function authNotification() {
  if (!window.Notification) {
    notificationsSupported = false;
  } else if (Notification.permission != "granted") {
    Notification.requestPermission()
      .then((permission: NotificationPermission) => {
        if (permission === "granted") {
          notificationsSupported = true;
        } else {
          console.log("User has blocked notifications.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    notificationsSupported = true;
  }
}

export function notify(title: string, body: string) {
  if (notificationsSupported) {
    new Notification(title, {
      body: body,
      icon: "https://jstrisplus.github.io/jstris-plus-assets/logo.png",
    });
  }
}
