<!-- Copyright © 2022 Jorge Brito

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->

<script context="module" lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	export type UpdateEditorDetail = {
		input: HTMLTextAreaElement;
		output: HTMLElement;
		content: HTMLElement;
		source: string;
	};

	export type UpdateEditor = CustomEvent<UpdateEditorDetail>;

	const range = (start: number, end: number) => new Array(end - start + 1).fill(0).map((_, i) => i + start);
</script>

<script lang="ts">
	export { className as class };
	export let hideLines = false;
	export let lineCount = 1;
	export let source = '';
	/* -------- Styling -------- */
	export let background = null as string;
	export let fontFamily = 'monospace';
	export let fontSize = '1rem';
	export let height = '100%';
	export let lineHeight = 'initial';
	export let lineNumbersBg = null;
	export let lineNumbersFg = 'rgba(64, 64, 64, 0.9)';
	export let padding = '1rem';
	export let padx = '0rem';
	export let pady = '1rem';
	export let scrollThumb = '#222';
	export let scrollTrack = 'transparent';
	export let tabSize = 2;
	export let width = '100%';

	export let inputClass = '';
	export let outputClass = '';
	export let contentClass = '';
	export let lineNumbersClass = '';

	let input: HTMLTextAreaElement;
	let output: HTMLElement;
	let content: HTMLElement;
	let className = 'editor';
	let linesWidth = 0;

	let lastWidth = 0,
		lastHeight = 0;

	const dispatch = createEventDispatcher<{ update: UpdateEditorDetail }>();

	export const update = () => {
		if (output) {
			output.textContent = source.at(-1) == '\n' ? source + ' ' : source;
			dispatch('update', { input, output, content, source });
			setTimeout(resizeInput, 0);
		}
	};

	function resizeInput() {
		if (content) {
			const { width, height } = content.getBoundingClientRect();

			if (width != lastWidth) {
				input.style.width = `${width}px`;
				lastWidth = width;
			}

			if (height != lastHeight) {
				input.style.height = `${height}px`;
				lastHeight = height;
			}
		}
	}

	function ident(e: KeyboardEvent) {
		if (e.key == 'Tab') {
			e.preventDefault();
			const cursor = input.selectionEnd;
			const [before, after] = [source.slice(0, cursor), source.slice(cursor)];

			source = before + '\t' + after;
			(document.activeElement as HTMLElement).blur();
			update();
			setTimeout(() => (input.selectionEnd = cursor + 1), 0);
			setTimeout(() => input.focus(), 0);
		}
	}

	onMount(update);
	afterUpdate(update);

	$: lineCount = source ? source.split('\n').length : 1;
</script>

<svelte:window on:resize={resizeInput} />

<div
	class="editor {className} max-h-full"
	style:--background={background}
	style:--fontFamily={fontFamily}
	style:--fontSize={fontSize}
	style:--height={height}
	style:--lineHeight={lineHeight}
	style:--lineNumbersBg={lineNumbersBg}
	style:--lineNumbersFg={lineNumbersFg}
	style:--marginLeft="calc({linesWidth}px + var(--padx))"
	style:--padding={padding}
	style:--padx={padx ?? padding ?? (hideLines ? '1rem' : '0rem')}
	style:--pady={pady ?? padding}
	style:--scrollThumb={scrollThumb}
	style:--scrollTrack={scrollTrack}
	style:--tabSize={tabSize}
	style:--width={width}
	class:with-bg={!!background}
	on:scroll>
	{#if !hideLines}
		<ol class="lines {lineNumbersClass}" class:with-lines-bg={!!lineNumbersBg} bind:clientWidth={linesWidth}>
			{#each range(1, lineCount) as n}
				<li class={lineNumbersClass}>{n}</li>
			{/each}
		</ol>
	{/if}
	<textarea
		class="editor-input {inputClass}"
		spellcheck={false}
		bind:this={input}
		bind:value={source}
		on:input={update}
		on:keydown={ident}
		on:input
		on:keypress
		on:keydown
		on:focus
		on:click
		on:mousedown
		on:mouseup
		on:mousemove
		on:mouseenter
		on:mouseleave
		on:mouseover />
	<pre class="editor-content {contentClass}" aria-hidden="true" bind:this={content}><code class="editor-output {outputClass}" bind:this={output} /></pre>
</div>

<style>
	.editor,
	.editor *,
	.editor *::after,
	.editor *::before {
		box-sizing: border-box;
		margin: 0;
	}

	.editor {
		/* Sizing */
		width: var(--width);
		height: var(--height);
		/* Other */
		position: relative;
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--scrollThumb) var(--scrollTrack);
	}
	/* Only apply a background when it is provided */
	.with-bg {
		background: var(--background);
	}
	/* Remove bg from child elements */
	.with-bg .editor-input,
	.with-bg .output {
		background: transparent;
	}

	.lines {
		top: 0;
		left: 0;
		z-index: 10;
		position: sticky;
		color: var(--lineNumbersFg);
		padding: var(--pady) 0.825rem;
		background-color: inherit;
		min-height: 100%;
		height: max-content;
		min-width: 5ch;
		width: max-content;
		list-style-type: none;
		text-align: right;
	}

	.lines.with-lines-bg {
		background-color: var(--lineNumbersBg);
	}

	.editor-input,
	.editor-output {
		tab-size: var(--tabSize);
		padding: var(--pady) var(--padx);
		padding-left: var(--marginLeft);
	}

	.editor-input,
	.editor-output,
	.lines {
		font-family: var(--fontFamily);
		font-size: var(--fontSize);
		line-height: var(--lineHeight);
	}

	.editor-input,
	.editor-content,
	.editor-output {
		min-width: 100%;
		min-height: 100%;
		overflow: hidden;
	}

	.editor-input,
	.editor-content {
		top: 0;
		left: 0;
		position: absolute;
		white-space: pre;
	}

	.editor-content {
		pointer-events: none;
	}

	.editor-input {
		z-index: 1;
		caret-color: #fff;
		color: transparent;
		background: transparent;
		resize: none;
		border: none;
		border-radius: 0;
		outline: none;
	}

	.editor::-webkit-scrollbar {
		width: 11px;
		height: 11px;
		cursor: default;
	}

	.editor::-webkit-scrollbar-thumb {
		background-color: var(--scrollThumb);
		border-radius: 99px;
	}

	.editor::-webkit-scrollbar-track {
		background-color: var(--scrollTrack);
	}

	.editor::-webkit-scrollbar-corner {
		background: var(--scrollTrack);
	}
</style>
