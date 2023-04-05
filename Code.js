function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu("Custom Menu")
    .addItem("Show sidebar", "showSidebar")
    .addToUi();
}

function showSidebar() {
  var html =
    HtmlService.createHtmlOutputFromFile("Page").setTitle("File Explorer");
  SpreadsheetApp.getUi().showSidebar(html);
}

function getFiles() {
  const allFiles = [];
  let pageToken;

  do {
    const { items, nextPageToken } = Drive.Files.list({
      maxResults: 400,
      fields:
        "nextPageToken,items(id,title,mimeType,createdDate,modifiedDate,alternateLink,ownedByMe,owners(emailAddress))",
      q: "trashed = false",
      pageToken,
    });

    items.forEach(
      (item) => (item["mime"] = item.mimeType.split(".")[2] ?? "other")
    );
    allFiles.push(...items);
    pageToken = nextPageToken;
  } while (pageToken);

  const filesJSON = JSON.stringify(allFiles);

  return filesJSON;
}
