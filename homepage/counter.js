const SUPABASE_URL = "https://yzqforpyicopxcadhbhm.supabase.co";
const SUPABASE_KEY = "sb_publishable_LZq3YpQMzpoVIhmkKK4Ckw_t-6PtsIa";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function countVisit() {

    const { data, error } = await supabaseClient
        .from("site_stats")
        .select("visits")
        .eq("id", 1)
        .single();

    if (error) {
        console.log(error);
        return;
    }

    let newCount = data.visits + 1;

    const { error: updateError } = await supabaseClient
        .from("site_stats")
        .update({ visits: newCount })
        .eq("id", 1);

    if (updateError) {
        console.log(updateError);
        return;
    }

    document.getElementById("signal-counter").innerHTML =
        `Thank you, observer. This signal is happy to have traveled ${newCount} times across the network.`;
}

countVisit();