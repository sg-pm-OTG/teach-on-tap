import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();
    
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: 'filePath is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Converting file:", filePath);

    // Get auth header to pass to Supabase
    const authHeader = req.headers.get('Authorization');
    
    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Download the WebM file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('session-recordings')
      .download(filePath);

    if (downloadError) {
      console.error("Download error:", downloadError);
      return new Response(
        JSON.stringify({ error: `Failed to download file: ${downloadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("File downloaded, size:", fileData.size, "bytes");

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    
    // Return the WebM file as-is (WebM is widely supported)
    // True MP3 conversion would require a dedicated transcoding service
    const fileName = filePath.split('/').pop() || 'recording.webm';
    
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/webm',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error: any) {
    console.error("Error in convert-audio-to-mp3:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
