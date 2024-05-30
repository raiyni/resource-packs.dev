<script>
	import Editor from './Editor.svelte';

	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { writable } from 'svelte/store';

	export let code = writable('<div>Hello, world!</div>');
    export let onChange = (e) => {}

	function update(e) {
        var output = e.detail.output
        delete output.dataset.highlighted
		hljs.highlightElement(output)
        onChange(e)
	}

	function highlight(output) {
		// e.detail.output is the <code> element
		// that displays the processed text
		hljs.highlightElement(output);
	}
</script>

<Editor fontSize="12px" bind:source={$code} width="100%" height="100%" class="hljs" outputClass="properties" on:update={update} />

<style>
</style>