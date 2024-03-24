async function fetchRandomWords() {
  const response = await window.fetch(
    "https://random-word-api.herokuapp.com/all"
  );
  const { words, errors } = await response.json();
  if (response.ok) {
    return words;
  } else {
    const error = new Error(
      errors?.map((e: any) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}

export default fetchRandomWords;
