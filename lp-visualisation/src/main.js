import App from './App.svelte';
import Robotic from "./Robotic.svelte";

const app = new Robotic({
	target: document.body,
	props: { }
});

export default app;