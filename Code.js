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
  //if (cached != null) return cached;

  const allFiles = [];
  let pageToken;

  do{
    const { items, nextPageToken } = Drive.Files.list({
      maxResults: 300,
      fields: "nextPageToken,items(id,title,mimeType,createdDate,modifiedDate,alternateLink,ownedByMe,owners(emailAddress))",
      q: "trashed = false",
      pageToken
    });

    items.forEach(
      item => (item["mime"] = item.mimeType.split(".")[2] ?? "other")
    );
    console.log(items.length);
    allFiles.push(...items);
    pageToken = nextPageToken;
  } while(pageToken);

  console.log(allFiles)
  const filesJSON = JSON.stringify(allFiles);
  //cache.put(CACHE_SERVICE_KEY, filesJSON, 1500); // cache for 25 minutes

  return filesJSON;
}

function listCalendars() {
  let pageToken;
  do {
    console.log(pageToken)
    calendars = Drive.Files.list({
      maxResults: 100,
      pageToken: pageToken,
    });
    if (!calendars.items || calendars.items.length === 0) {
      console.log("No calendars found.");
      return;
    }
    // Print the calendar id and calendar summary
    pageToken = calendars.nextPageToken;
    console.log(calendars.incompleteSearch);
    console.log(calendars.items.length);
  } while (pageToken);
}

function getDrives() {
  const drives = Drive.Drives.list();
  console.log(drives);
}
