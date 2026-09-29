// Public configuration only. Never put an OpenAI API key here.
window.PORTFOLIO_VOICE_CONFIG = Object.freeze({
  // Existing BSU HTTPS domain, routed to the separate portfolio voice service.
  sessionEndpoint: 'https://bsu-uni.edu.az/portfolio-voice/api/session',
  localSessionEndpoint: 'http://localhost:5079/api/session'
});
