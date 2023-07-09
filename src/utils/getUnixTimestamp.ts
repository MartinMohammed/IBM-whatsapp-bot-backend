function getUnixTimestamp(): number {
  // Get current Unix timestamp in seconds
  const timestampSeconds = Math.floor(Date.now() / 1000);
  return timestampSeconds;
}

export default getUnixTimestamp;
