function findSongs() {
  const apiKeys = [
     "AIzaSyBPnjLls3PUtH-pRef6e08K7324fDKWK5Q",
     "AIzaSyBGsigK_jFTdXuBRItsg3rZyyc1JU3oP3g",
     "AIzaSyCjFM-koaDwALigkqqpAhYK25lN8qR80xA",
     "AIzaSyA9oEjDLjEJ-DvPMaMJeb9NIfLPBxIOj0A",
     "AIzaSyB2wLmEB_c3-cOhITZJdRCxih3YDAjAHtU",
     "AIzaSyDKA24MzVYIv7BaNHc6Gd6by5Az2Xz2j84",
     "AIzaSyBpd5BIYN_jOaLHf3asuB1m1p8akqIACfs",
     "AIzaSyBy1-pnGtQqwe5NzwcwJssFqqdhamvdqp0",
     "AIzaSyBRTmz56sFl6Bz3m8aNswr-PromnJ6Qce4",
     "AIzaSyBECLG2JdV6LH7Oy3Q9JXN9kr-5WhbPnUE",
     "AIzaSyBGr7regBDmP6L1-9G5r68Vucii7pjDF9g",
     "AIzaSyB5CP2Uuj14I80Jl9oDqxZqCd2SRKRuzCQ",
     "AIzaSyDJRKbTduKTfD5eD1qhFOq7U8vVfIopsJc",
     "AIzaSyBAB5BwMWGNH9l1LoR9v-1Bp-DCKtRcl4w",
     "AIzaSyBHVFJ4qugUPjOUuzUINt8q82U7uEWOJlo",
     "AIzaSyCBfKafxoU38Wyy3El5pxq_Io1U3c2byL8",
     "AIzaSyBxnFU40L4rP88N1bBo1z3-_CC2nKhTDlk",
     "AIzaSyA9Yam7nB3lWdGphuKBjeXHXjOW3lRzQBE",
     "AIzaSyCQ-RHLTW7LdylmUItKlYdaUey_PP2UbfY",
     "AIzaSyBuJd6XUvmgIFhucWcpIruIfpHr22CXSJg"
    ];
  let currentApiKeyIndex = 0;
  const input = document.getElementById("songs").value.trim();
  if (input === "") {
    alert("Please enter at least one topic.");
    return;
  }
  const songs = input.split(",").filter((song) => song.trim() !== "");
  if (songs.length === 0) {
    alert("Please enter at least one valid topic.");
    return;
  }
  if (songs.length > 50) {
    alert("Maximum no.of topics you can search at a time is 50.");
    return;
  }
  const output = document.getElementById("output");
  output.innerHTML = "";
  const promises = [];
  songs.forEach((song, index) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      song
    )}&type=video&key=${apiKeys[currentApiKeyIndex]}`;
    const promise = fetch(url)
      .then((response) => {
        if (response.status === 403) {
          currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
          console.log(`Switched to API key index: ${currentApiKeyIndex}`);
          const newUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            song
          )}&type=video&key=${apiKeys[currentApiKeyIndex]}`;
          return fetch(newUrl);
        } else {
          return response;
        }
      })
      .then((response) => response.json())
      .then((data) => {
        const videoId = data.items[0].id.videoId;
        const videoTitle = data.items[0].snippet.title;
        const videoThumbnail = data.items[0].snippet.thumbnails.default.url;
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
        const songItem = document.createElement("li");
        songItem.classList.add("song");
        const number = document.createElement("span");
        number.classList.add("song-number");
        number.textContent = `${index + 1}. `;
        const title = document.createElement("span");
        title.classList.add("song-title");
        title.textContent = videoTitle;
        const thumbnail = document.createElement("img");
        thumbnail.src = videoThumbnail;
        thumbnail.alt = videoTitle;
        const link = document.createElement("a");
        link.href = videoLink;
        link.textContent = "Watch on YouTube";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.classList.add("song-link");
        songItem.appendChild(number);
        songItem.appendChild(thumbnail);
        songItem.appendChild(title);
        songItem.appendChild(link);
        songItem.setAttribute("data-index", index);
        output.appendChild(songItem);
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error finding video for "${song}".`;
        output.appendChild(errorMessage);
      });
    promises.push(promise);
  });
  Promise.all(promises).then(() => {
    console.log("All videos found.");
    const items = Array.from(output.querySelectorAll("li"));
    items.sort((a, b) => {
      const indexA = parseInt(a.getAttribute("data-index"));
      const indexB = parseInt(b.getAttribute("data-index"));
      return indexA - indexB;
    });
    output.innerHTML = "";
    items.forEach((item) => {
      output.appendChild(item);
    });
 
  });
}
