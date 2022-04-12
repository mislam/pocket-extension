/**
 * Hide (mute) the error regarding Wasm.
 * Note: Our code still works inspite of this error message.
 */
window.addEventListener('unhandledrejection', (event) => {
   if (
      event.reason.message ===
      'Aborted(CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder). Build with -s ASSERTIONS=1 for more info.'
   ) {
      event.preventDefault()
   }
})

export default {}
