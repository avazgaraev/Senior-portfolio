(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const startButton = $('voice-start');
  if (!startButton) return;
  const muteButton = $('voice-mute'), stopButton = $('voice-stop');
  const stage = $('voice-stage'), state = $('voice-state'), notice = $('voice-notice');
  const timer = $('voice-timer'), resumeButton = $('voice-audio-resume');
  const portrait = document.querySelector('.voice-portrait-wrap');
  const bars = [...document.querySelectorAll('.voice-waveform i')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const config = window.PORTFOLIO_VOICE_CONFIG || {};
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const endpoint = local ? (config.localSessionEndpoint || config.sessionEndpoint) : config.sessionEndpoint;
  let current = null, available = false;
  let quotaBlocked = false, resetTimer = null;
  const dailyLimitMessage = "You've used today's 3-minute voice demo allowance. Please try again tomorrow. Your access renews at 00:00 Baku time.";
  const timeLabel = seconds => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.max(0, seconds) % 60).padStart(2, '0')}`;
  const captions = { user: { end: 0, text: '' }, assistant: { end: 0, text: '' } };

  function controls(phase) {
    stage.dataset.state = phase;
    startButton.disabled = !available || phase === 'connecting' || phase === 'active' || phase === 'closing';
    muteButton.disabled = phase !== 'active';
    stopButton.disabled = !['connecting', 'active'].includes(phase);
  }
  function displayQuota(quota) {
    if (!quota) return;
    const wasBlocked = quotaBlocked;
    quotaBlocked = Boolean(quota.limitReached || quota.sessionActive);
    const panel = $('voice-allowance');
    panel.dataset.limited = String(Boolean(quota.limitReached));
    $('voice-allowance-title').textContent = quota.limitReached ? 'Your daily demo is complete' : quota.sessionActive ? 'A conversation is already active' : 'Your daily voice demo';
    $('voice-allowance-copy').textContent = quota.message || 'Enjoy 3 minutes each day, across your conversations. Your allowance renews at 00:00 Baku time.';
    $('voice-allowance-remaining').textContent = quota.limitReached ? 'Come back tomorrow for another conversation' : quota.sessionActive ? 'Please end the current conversation first' : `${timeLabel(quota.remainingSeconds)} available today`;
    if (quota.limitReached || quota.sessionActive) available = false;
    if (!current) {
      controls('idle');
      if (quota.limitReached || quota.sessionActive) { state.textContent = quota.limitReached ? 'Daily allowance reached' : 'Conversation already in progress'; notice.textContent = quota.message; }
      else if (wasBlocked) { state.textContent = 'Ready when you are'; notice.textContent = 'Your voice demo allowance is available. Press Start to begin.'; }
    }
    clearTimeout(resetTimer);
    const delay = Date.parse(quota.resetsAt) - Date.now();
    if (delay > 0) resetTimer = setTimeout(() => { if (!current) void refreshAvailability().catch(() => {}); }, Math.min(delay + 1000, 86401000));
  }
  async function refreshAvailability() {
    const response = await fetch(endpoint.replace(/\/session\/?$/, '/status'), { signal: AbortSignal.timeout(5000), cache: 'no-store' });
    const status = await response.json();
    if (!response.ok || !status.ready) throw new Error('Voice service is not configured yet');
    available = !status.quota?.limitReached && !status.quota?.sessionActive;
    displayQuota(status.quota);
    if (!current) controls('idle');
    return status;
  }
  function clearCaptions() {
    for (const speaker of ['user', 'assistant']) {
      captions[speaker] = { end: 0, text: '' };
      $(`voice-${speaker}-text`).textContent = '';
      $(`voice-${speaker}-caption`).hidden = true;
    }
    $('voice-transcript-empty').hidden = false;
  }
  $('voice-clear').addEventListener('click', clearCaptions);

  // Two independent streams preserve full-duplex captions without inventing turns.
  function caption(speaker, event) {
    if (typeof event.delta !== 'string') return;
    const target = captions[speaker];
    if (target.text && Number(event.start_ms) - target.end > 1800) target.text += '\n\n';
    target.text = (target.text + event.delta).slice(-24000);
    target.end = Number(event.end_ms) || target.end;
    $(`voice-${speaker}-text`).textContent = target.text;
    $(`voice-${speaker}-caption`).hidden = false;
    $('voice-transcript-empty').hidden = true;
    const container = $('voice-transcripts');
    if (container.scrollHeight - container.scrollTop - container.clientHeight < 140) container.scrollTop = container.scrollHeight;
  }
  function command(run, type) {
    if (run.started && run.channel?.readyState === 'open') run.channel.send(JSON.stringify({ type }));
  }
  async function remoteStop(run) {
    if (!run.cleanupToken) return;
    const token = run.cleanupToken;
    run.cleanupToken = null;
    try {
      await fetch(endpoint.replace(/\/session\/?$/, '/stop'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), keepalive: true, signal: AbortSignal.timeout(12000)
      });
    } catch { /* The backend also enforces the session deadline. */ }
    if (!current) {
      try { await refreshAvailability(); }
      catch { available = false; controls('idle'); }
    }
  }
  function release(run) {
    clearTimeout(run.startDeadline); clearTimeout(run.closeDeadline);
    clearTimeout(run.openingDeadline); clearTimeout(run.disconnectDeadline);
    clearInterval(run.tick); cancelAnimationFrame(run.frame);
    run.controller.abort();
    run.stream?.getTracks().forEach(track => track.stop());
    run.channel?.close(); run.peer?.close();
    run.audio.pause(); run.audio.srcObject = null;
    run.audioContext?.close().catch(() => {});
    if (current !== run) return;
    current = null;
    resumeButton.hidden = true;
    muteButton.textContent = 'Mute mic'; muteButton.setAttribute('aria-pressed', 'false');
    portrait.style.setProperty('--voice-level', 0);
    bars.forEach(bar => { bar.style.height = '5px'; });
    controls('idle');
  }
  function finish(run, message) {
    if (current !== run) return;
    if (run.cleanupToken) available = false;
    void remoteStop(run);
    release(run);
    state.textContent = message;
  }
  function stop(message = 'Conversation ended') {
    const run = current;
    if (!run || run.closing) return;
    run.closing = true;
    run.endMessage = message;
    controls('closing');
    state.textContent = 'Ending conversation…';
    run.stream?.getTracks().forEach(track => { track.enabled = false; });
    run.audio.pause();
    if (run.started && run.channel?.readyState === 'open') {
      command(run, 'session.close');
      run.closeDeadline = setTimeout(() => finish(run, message), 4000);
    } else finish(run, message);
  }
  stopButton.addEventListener('click', () => stop());
  muteButton.addEventListener('click', () => {
    const run = current;
    if (!run?.started || run.closing) return;
    run.muted = !run.muted;
    run.stream.getAudioTracks().forEach(track => { track.enabled = !run.muted; });
    command(run, run.muted ? 'session.input_audio.mute' : 'session.input_audio.unmute');
    muteButton.textContent = run.muted ? 'Unmute mic' : 'Mute mic';
    muteButton.setAttribute('aria-pressed', String(run.muted));
    state.textContent = run.muted ? 'Microphone muted' : 'Listening';
  });
  resumeButton.addEventListener('click', async () => {
    const run = current;
    if (!run) return;
    try { await run.audio.play(); await run.audioContext?.resume(); resumeButton.hidden = true; }
    catch { notice.textContent = 'Speaker audio is blocked. Check the browser’s sound permissions.'; }
  });

  function meter(run, stream) {
    if (!run.audioContext) return null;
    const analyser = run.audioContext.createAnalyser();
    analyser.fftSize = 256;
    run.audioContext.createMediaStreamSource(stream).connect(analyser);
    return { analyser, values: new Uint8Array(analyser.fftSize) };
  }
  function level(meter) {
    if (!meter) return 0;
    meter.analyser.getByteTimeDomainData(meter.values);
    return Math.min(1, Math.sqrt(meter.values.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / meter.values.length) * 7);
  }
  async function beginOpening(run) {
    if (current !== run || run.closing || !run.started || !run.cleanupToken || run.openingSent) return;
    run.openingSent = true;
    state.textContent = 'Preparing greeting…';
    try {
      const response = await fetch(endpoint.replace(/\/session\/?$/, '/greet'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: run.cleanupToken }),
        signal: AbortSignal.any([run.controller.signal, AbortSignal.timeout(28000)])
      });
      const result = await response.json();
      if (current !== run || run.closing) return;
      if (!response.ok || !result.accepted) throw new Error(result.error || 'The assistant could not begin the conversation.');
      run.openingAccepted = true;
      run.openingDeadline = setTimeout(() => {
        if (current === run && !run.receivedReply && !run.closing) {
          run.replyDelayed = true;
          notice.textContent = 'The connection is open, but no assistant reply has arrived yet. You can speak, or end and reconnect.';
        }
      }, 15000);
    } catch (error) {
      if (current !== run || run.closing) return;
      const message = error.name === 'TimeoutError' ? 'The greeting timed out. Please end and reconnect.' : 'The assistant could not begin the conversation. Please try again.';
      notice.textContent = message;
      stop(message);
    }
  }
  function animate(run) {
    if (current !== run) return;
    const output = level(run.outputMeter), input = run.muted ? 0 : level(run.inputMeter);
    const volume = Math.max(output, input);
    portrait.style.setProperty('--voice-level', reducedMotion.matches ? 0 : output.toFixed(3));
    bars.forEach((bar, index) => {
      bar.style.height = reducedMotion.matches ? '5px' : `${5 + volume * (10 + 24 * Math.abs(Math.sin(index * .71 + performance.now() / 300)))}px`;
    });
    if (output > .025) run.receivedReply = true;
    if (run.started && !run.closing) {
      state.textContent = !run.openingAccepted ? 'Preparing greeting…'
        : output > .08 ? 'Speaking'
        : !run.receivedReply ? (run.replyDelayed ? 'Waiting for the assistant…' : 'Greeting…')
        : run.muted ? 'Microphone muted' : input > .06 ? 'Hearing you' : 'Listening';
    }
    run.frame = requestAnimationFrame(() => animate(run));
  }
  function waitForIce(peer, signal) {
    return new Promise((resolve, reject) => {
      const cleanup = () => { clearTimeout(timeout); peer.removeEventListener('icegatheringstatechange', check); signal.removeEventListener('abort', abort); };
      const check = () => { if (peer.iceGatheringState === 'complete') { cleanup(); resolve(); } };
      const abort = () => { cleanup(); reject(new DOMException('Cancelled', 'AbortError')); };
      const timeout = setTimeout(() => { cleanup(); reject(new Error('Network setup timed out. Try another network.')); }, 12000);
      peer.addEventListener('icegatheringstatechange', check);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort(); else check();
    });
  }
  async function start() {
    if (current || !available) return;
    clearCaptions(); timer.textContent = '00:00';
    const run = { controller: new AbortController(), audio: new Audio(), started: false, muted: false, closing: false };
    current = run;
    controls('connecting'); state.textContent = 'Allow microphone access to begin';
    notice.textContent = 'Your microphone is used only for this conversation. Press End to disconnect.';
    run.audio.autoplay = true;
    try {
      const status = await refreshAvailability();
      if (current !== run) return;
      if (status.quota?.limitReached || status.quota?.sessionActive) {
        finish(run, status.quota.message);
        displayQuota(status.quota);
        return;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) { run.audioContext = new AudioContextClass(); await run.audioContext.resume(); }
      if (current !== run) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (current !== run) { stream.getTracks().forEach(track => track.stop()); return; }
      run.stream = stream;
      run.inputMeter = meter(run, stream);
      stream.getAudioTracks().forEach(track => track.addEventListener('ended', () => { if (current === run && !run.closing) stop('Microphone disconnected'); }));
      state.textContent = 'Connecting…';
      run.startDeadline = setTimeout(() => { if (current === run && !run.started) finish(run, 'Connection timed out. Please try again.'); }, 45000);
      const peer = run.peer = new RTCPeerConnection();
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
      peer.addEventListener('track', event => {
        if (current !== run || run.closing) return;
        const remote = event.streams[0] || new MediaStream([event.track]);
        run.audio.srcObject = remote;
        run.outputMeter = meter(run, remote);
        run.audio.play().catch(() => { if (current === run) resumeButton.hidden = false; });
      });
      peer.addEventListener('connectionstatechange', () => {
        if (current !== run) return;
        if (peer.connectionState === 'failed') finish(run, 'Connection lost. Start a new conversation to reconnect.');
        else if (peer.connectionState === 'disconnected') {
          clearTimeout(run.disconnectDeadline);
          run.disconnectDeadline = setTimeout(() => { if (current === run && peer.connectionState === 'disconnected') finish(run, 'Connection lost. Start a new conversation to reconnect.'); }, 8000);
        } else if (peer.connectionState === 'connected') clearTimeout(run.disconnectDeadline);
      });
      const channel = run.channel = peer.createDataChannel('oai-events');
      channel.addEventListener('close', () => { if (current === run) finish(run, run.endMessage || 'Connection closed'); });
      channel.addEventListener('message', event => {
        if (current !== run) return;
        let data; try { data = JSON.parse(event.data); } catch { return; }
        if (data.type === 'session.started') {
          run.started = true;
          if (run.closing) { command(run, 'session.close'); return; }
          clearTimeout(run.startDeadline); controls('active');
          void beginOpening(run);
        } else if (data.type === 'session.input_transcript.delta') caption('user', data);
        else if (data.type === 'session.output_transcript.delta') {
          run.receivedReply = true;
          clearTimeout(run.openingDeadline);
          caption('assistant', data);
        }
        else if (data.type === 'session.closed') finish(run, run.endMessage || 'Conversation ended');
        else if (data.type === 'error') finish(run, 'The voice service could not continue. Please try again later.');
      });
      await peer.setLocalDescription(await peer.createOffer());
      await waitForIce(peer, run.controller.signal);
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp: peer.localDescription.sdp }), signal: run.controller.signal
      });
      const result = await response.json();
      if (!response.ok && result.quota) displayQuota(result.quota);
      if (!response.ok) throw new Error(result.error || 'The voice service is unavailable. Please try again later.');
      run.cleanupToken = result.cleanupToken;
      if (current !== run) { void remoteStop(run); return; }
      void beginOpening(run);
      if (typeof result.transport?.sdp !== 'string') throw new Error('The voice connection could not be prepared.');
      await peer.setRemoteDescription({ type: 'answer', sdp: result.transport.sdp });
      const connectedAt = Date.now(), duration = Math.max(1, Number(result.maxSessionSeconds) || 180);
      const expiresAt = Date.parse(result.expiresAt) || connectedAt + duration * 1000;
      $('voice-allowance-title').textContent = "Today's conversation time";
      $('voice-allowance-copy').textContent = 'Your daily allowance is shared across conversations on this network.';
      $('voice-allowance').dataset.limited = 'false';
      run.tick = setInterval(() => {
        const elapsed = Math.floor((Date.now() - connectedAt) / 1000);
        const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        timer.textContent = timeLabel(elapsed);
        $('voice-allowance-remaining').textContent = `${timeLabel(remaining)} remaining today`;
        if (remaining === 0) {
          displayQuota({ dailyLimitSeconds: result.dailyLimitSeconds || 180, remainingSeconds: 0, sessionActive: false,
            limitReached: true, resetsAt: result.resetsAt, message: dailyLimitMessage });
          notice.textContent = dailyLimitMessage;
          stop('Your daily voice demo is complete. Please try again tomorrow.');
        }
      }, 1000);
      animate(run);
    } catch (error) {
      if (current !== run) return;
      let message = error.message || 'Unable to connect. Please try again.';
      if (error.name === 'NotAllowedError') message = 'Microphone permission was denied. Allow it in your browser and try again.';
      else if (error.name === 'NotFoundError') message = 'No microphone was found. Connect one and try again.';
      else if (error.name === 'NotReadableError') message = 'Your microphone is unavailable. Check its connection and other apps.';
      else if (error instanceof TypeError) message = 'Cannot reach the voice service. Check the connection and try again.';
      finish(run, message);
      notice.textContent = message;
    }
  }
  startButton.addEventListener('click', start);
  addEventListener('pagehide', () => {
    const run = current;
    if (!run) return;
    command(run, 'session.close'); void remoteStop(run); release(run);
  });
  addEventListener('focus', () => { if (endpoint && !current) void refreshAvailability().catch(() => {}); });

  async function initialize() {
    if (!endpoint) { state.textContent = 'Preview · voice connection coming soon'; return; }
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
      state.textContent = 'Use a supported browser on HTTPS or localhost';
      notice.textContent = 'Live conversation needs microphone support and a secure connection.'; return;
    }
    try {
      const url = new URL(endpoint, location.href);
      if (url.protocol !== 'https:' && !(local && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error('Secure voice connection required');
      const status = await refreshAvailability();
      if (!status.quota?.limitReached && !status.quota?.sessionActive) {
        state.textContent = 'Ready when you are';
        notice.textContent = 'Ready for a conversation. Microphone access starts only when you press Start.';
      }
    } catch {
      state.textContent = 'Voice connection unavailable';
      notice.textContent = 'The voice demo is currently unavailable. Please explore the projects or come back later.';
    }
  }
  void initialize();
})();
