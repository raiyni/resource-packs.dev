/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch("/propertiesMap.json")
    const mapped = await  res.json();

	return {
		mapped
	};
}