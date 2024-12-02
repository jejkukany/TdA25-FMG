export default async function Home() {
  const data = await fetch("http://localhost:3000/api/test");
  const test = await data.json();
  return <div>Hello TdA {JSON.stringify(test)}</div>;
}
