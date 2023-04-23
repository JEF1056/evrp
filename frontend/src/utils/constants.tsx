export const feedEndpoint =
  process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:5000/feed_test`
    : `https://ml-1.mango-tone.ts.net/feed`;

export const routingEndpoint = `http://${window.location.hostname}:5000/route`;

export const vehicleId = "281474981766008";

export const vehicleAnimationSpeed =
  process.env.NODE_ENV === "development" ? 250 : 5000;
