export const dbConfig = {
  uri: process.env.MONGO_URI || "mongodb://localhost:27017/transitops",
  name: "transitops",
};

export const sampleData = [
  { name: "Fleet Manager", role: "fleet_manager" },
  { name: "Dispatcher", role: "dispatcher" },
  { name: "Safety Officer", role: "safety_officer" },
];
