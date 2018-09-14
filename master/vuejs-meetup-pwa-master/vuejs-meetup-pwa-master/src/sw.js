self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      tag: 'simple-push-demo-notification',
      icon: data.notification.icon,
    });

    self.addEventListener('notificationclick', () => {
      /* eslint-disable */
      if (clients.openWindow) {
        clients.openWindow(data.notification.click_action);
      }
    });
  }
});
