export default defineUnlistedScript(() => {
  console.log("injected.ts ran.")

  new Function('console.log("Does it run from string?")')();
})