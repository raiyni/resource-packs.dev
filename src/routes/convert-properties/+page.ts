/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch('/propertiesMap.json');
	const mapped = await res.json();

	const res2 = await fetch('/propertiesMap.json');
	const opacity = await res2.json();

	return {
		mapped,
		opacity
	};
}
