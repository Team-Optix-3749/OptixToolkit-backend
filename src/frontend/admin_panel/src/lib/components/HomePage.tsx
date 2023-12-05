export default function HomePage() {
  //check if user is logged in in the background... if not remove auth cookie and redirect

  return <main>
    <button onClick={async () => {
      const f = await (globalThis as any).background_validate();

      console.log(f)
    }}>hello</button>
  </main>;
}
