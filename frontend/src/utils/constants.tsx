export const dataEndpoint =
  process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:5000/feed_test?vehicleId=281474981766008`
    : `http://${window.location.hostname}:5000/feed?vehicleId=281474981766008`;

export const vehicleAnimationSpeed =
  process.env.NODE_ENV === "development" ? 250 : 5000;
