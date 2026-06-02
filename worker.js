const WEAK_TLS = new Set(["TLSv1", "TLSv1.0", "TLSv1.1"]);

export default {
  fetch(request, env) {
    const tlsVersion = request.cf?.tlsVersion;

    if (WEAK_TLS.has(tlsVersion)) {
      return new Response("TLS 1.2 or newer is required.", {
        status: 426,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
          "Upgrade": "TLS/1.2",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
