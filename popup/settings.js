function saveOptions(e) {
  //e.preventDefault();
  SearchTags = document.querySelector("#Search").value.split(",");
  BlockTags = document.querySelector("#Block").value.split(",");
  browser.storage.sync.set({
    Search: SearchTags,
    Block: BlockTags
  });
}

function restoreOptions() {
  function setCurrentChoice1(result) {
    document.querySelector("#Search").value = result.Search ? result.Search.join(",") : "";
  }
  function setCurrentChoice2(result) {
    document.querySelector("#Block").value = result.Block ? result.Block.join(",") : "";
  }
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let get1 = browser.storage.sync.get("Search");
  get1.then(setCurrentChoice1, onError);
  let get2 = browser.storage.sync.get("Block");
  get2.then(setCurrentChoice2, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
