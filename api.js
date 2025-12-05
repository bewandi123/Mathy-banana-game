// Call the Banana API to get a new puzzle
export async function fetchBananaPuzzle() {
  const res = await fetch("https://marcconrad.com/uob/banana/api.php");
  if (!res.ok) throw new Error("Failed to fetch Banana API");
  const data = await res.json();
  return data; 
}
