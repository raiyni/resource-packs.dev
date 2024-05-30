<script>
	import Editor from './Editor.svelte';

	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { writable } from 'svelte/store';

	export let code = writable('');
	export let language;

	function update(e) {
		var output = e.detail.output;
		delete output.dataset.highlighted;
		hljs.highlightElement(output);
	}
</script>

<Editor fontSize="12px" bind:source={$code} width="100%" height="100%" class="hljs" outputClass={language} on:update={update} />

<style>
</style>
