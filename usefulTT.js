Blocklist = [""];
Searchlist = [""];


function RefreshTagList() {
  function setCurrentChoice1(result) {
    Searchlist = result.Search || [""];
  }
  function setCurrentChoice2(result) {
    Blocklist = result.Block || [""];
  }
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let get1 = browser.storage.sync.get("Search");
  get1.then(setCurrentChoice1, onError);
  let get2 = browser.storage.sync.get("Block");
  get2.then(setCurrentChoice2, onError);
  return 0
}

function listener(details) {
  const filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  const data = [];
  if (details.url.includes("gql.twitch.tv")) {
    filter.ondata = (event) => {
      data.push(decoder.decode(event.data, { stream: true }));
    };
    filter.onstop = (event) => {
      data.push(decoder.decode());
      let str = data.join("");
      foo = str
      if (str.startsWith('[{"data":{')) {
        jsonobject = JSON.parse(str);
        streams = false;
        num = 0;
        for (let y in jsonobject){
          if ("streams" in jsonobject[y].data) {
            streams = jsonobject[y].data.streams.edges;
            num = y;
          } else if ("game" in jsonobject[y].data ? ("streams" in jsonobject[y].data.game ? ("cursor" in jsonobject[y].data.game.streams.edges[0]) : false ) : false ) {
            streams = jsonobject[y].data.game.streams.edges;
            num = y;
          }
        }
        if (streams) {
          for (let i in streams) {
            Node = streams[i].node;
            Tags = Node.freeformTags;
            FoundSearchlistTag = Searchlist.length > 1 ? false : (Searchlist.length == 0 ? true : (Searchlist[0] == "" ? true : false))
            FoundBlocklistTag = false

            for (let x in Tags) {
              if (Searchlist.includes(Tags[x].name)){
                FoundSearchlistTag = true;
              }
              if (Blocklist.includes(Tags[x].name)){
                FoundBlocklistTag = true
              }
            }

            if (!FoundSearchlistTag || FoundBlocklistTag){
              if ("streams" in jsonobject[num].data) {
                jsonobject[num].data.streams.edges[i].node.previewImageURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NDAiIGhlaWdodD0iMjQ4Ij48cmVjdCB3aWR0aD0iNDQwIiBoZWlnaHQ9IjI0OCIgc3R5bGU9ImZpbGw6cmdiKDAsMCwwKTtzdHJva2Utd2lkdGg6MztzdHJva2U6cmdiKDAsMCwwKSIgLz48L3N2Zz4="
              } else {
                jsonobject[num].data.game.streams.edges[i].node.previewImageURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NDAiIGhlaWdodD0iMjQ4Ij48cmVjdCB3aWR0aD0iNDQwIiBoZWlnaHQ9IjI0OCIgc3R5bGU9ImZpbGw6cmdiKDAsMCwwKTtzdHJva2Utd2lkdGg6MztzdHJva2U6cmdiKDAsMCwwKSIgLz48L3N2Zz4="
              }
            }
          }
        }
      foo = JSON.stringify(jsonobject)

      }
      filter.write(encoder.encode(foo));
      filter.close();
    
    };
  }
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["<all_urls>"], types: ["xmlhttprequest"]},
  ["blocking"]
);
browser.storage.onChanged.addListener(RefreshTagList)
RefreshTagList();
