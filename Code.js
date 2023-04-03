const CACHE_SERVICE_KEY = "my_files";

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu("Custom Menu")
    .addItem("Show sidebar", "showSidebar")
    .addToUi();
}

function showSidebar() {
  var html =
    HtmlService.createHtmlOutputFromFile("Page").setTitle("My custom sidebar");
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);
}

function getFiles() {
  const cache = CacheService.getUserCache();
  const cached = cache.get(CACHE_SERVICE_KEY);
  if (cached != null) return cached;

  const { items, nextPageToken } = Drive.Files.list({
    maxResults: 100,
    fields: "nextPageToken,items(id,title,mimeType,createdDate,alternateLink)",
    q: "trashed = false",
  });
  items.forEach(
    (item) => (item["mime"] = item.mimeType.split(".")[2] ?? "other")
  );

  const itemsJSON = JSON.stringify(items);
  cache.put(CACHE_SERVICE_KEY, itemsJSON, 1500); // cache for 25 minutes

  console.log(items.length);
  return itemsJSON;
}

function listCalendars() {
  let pageToken;
  do {
    calendars = Drive.Files.list({
      maxResults: 600,
      pageToken: pageToken,
    });
    if (!calendars.items || calendars.items.length === 0) {
      console.log("No calendars found.");
      return;
    }
    // Print the calendar id and calendar summary
    pageToken = calendars.nextPageToken;
    console.log(calendars.items, pageToken);
  } while (pageToken);
}

function getDrives() {
  const drives = Drive.Drives.list();
  console.log(drives);
}
