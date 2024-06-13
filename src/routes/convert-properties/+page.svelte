<script>
	import Code from '$lib/Code.svelte';
	import { writable } from 'svelte/store';

	export let data;

	let colorProperties = writable('# Paste your color.properties here');
	let code = writable('# overrides.toml output');

	colorProperties.subscribe((value) => {
		const lines = value.match(/[^\r\n]+/g);

		const output = [];
		const mapped = {};

		for (const line of lines) {
			if (line.indexOf('=') > -1) {
				const match = line.match(/(.*)=(.*)/);
				mapped[match[1]] = match[2];
			}
		}

		for (const [key, value] of Object.entries(data.mapped)) {
			if (!!mapped[value]) {
				output.push(`[${key}]
color=${mapped[value]}`);
			} else {
                console.warn(`${value} does not exist in properties`)
                output.push(`# [${key}]
# color=0`);
            }

			if(key in data.opacity) {
				var o = data.opacity[key]
				output.push(`# opacity=${o}`)
			}

			output.push("")
		}

		code.set(output.join('\n'));
	});
</script>

<div class="flex flex-col w-full overflow-auto">
	<div class="flex flex-1 overflow-auto">
		<div class="flex-1 card bg-base-300">
			<Code bind:code={colorProperties} language="properties" />
		</div>
		<div class="divider divider-horizontal"></div>
		<div class="flex-1 card bg-base-300">
			<Code bind:code language="ini" />
		</div>
	</div>
</div>
