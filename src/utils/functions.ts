export function formatEvent(event: string) {
  if (event && event.length > 1) {
    let firstChars: string = event.substring(0, 2);
    let lastChars: string = event.substring(2, event.length);
    switch (firstChars) {
      case 'E/':
        return `❌ ${lastChars}`
      case 'W/':
        return `🟠 ${lastChars}`
      case 'N/':
        return `📶 ${lastChars}`
      case 'D/':
        return `⚫ ${lastChars}`
      default:
        return event;
    }
  }
  return event;
}

export function getDataWithID(persistedActions: Array<any>, data: any) {
  return { ...data, id: persistedActions.length + 1 }
}
