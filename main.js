const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  var pre = "pre";
  var post = "post";
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}

(function () {
  const input = document.getElementById("search");
  const suggestionArea = document.getElementById("suggestion-area");

  const onFocus = () => {
    suggestionArea.style.display = "block";
  };

  const onBlur = (e) => {
    if (e.target === input || e.target === suggestionArea) {
      return;
    }

    suggestionArea.style.display = "none";
  };

  const onChange = (e) => {
    const { value } = e.target;
    processData(value);
  };

  const processData = async (value) => {
    suggestionArea.style.display = "block";
    suggestionArea.innerHTML = "";

    if (!value) return;

    try {
      const res = await getSuggestions(value);
      if (res.length > 0) {
        const list = document.createElement("ul");
        res.forEach((suggestion) => {
          const listItem = document.createElement("li");
          listItem.style.cursor = "pointer";
          listItem.innerText = suggestion;
          list.appendChild(listItem);
        });

        suggestionArea.innerHTML = "";
        suggestionArea.appendChild(list);
      }
    } catch (error) {
      console.error("Error while making network call", error);
    }
  };

  const onClick = (e) => {
    if (e.target === suggestionArea) return;

    const text = e.target.innerText;
    input.value = text;
    input.focus();
  };

  input.addEventListener("focus", onFocus);
  window.addEventListener("click", onBlur);
  input.addEventListener("keyup", onChange);
  suggestionArea.addEventListener("click", onClick, true);
})();
