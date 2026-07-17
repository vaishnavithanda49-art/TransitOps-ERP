import supabase from "./supabase.js";

async function testConnection() {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  if (error) {
    console.error("❌ Error:", error.message);
  } else {
    console.log("✅ Connected to Supabase!");
    console.log(data);
  }
}

testConnection();