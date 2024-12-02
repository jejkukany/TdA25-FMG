async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error for potential further handling
  }
}

function handleError(error: unknown): string {
  console.error("Error occurred:", error);

  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}

export default async function Home() {
  const apiUrl = `${process.env.URL ?? "https://13682ac4.app.deploy.tourde.app"}/api/test`;
  try {
    const testData = await fetchData(apiUrl);
    return <div>Hello TdA {JSON.stringify(testData)}</div>;
  } catch (error) {
    const errorMessage = handleError(error);
    return <div>Error: {errorMessage}</div>;
  }
}
