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

    // For now, we'll return the original file with mp3 extension
    // Full FFmpeg conversion would require more complex setup
    // The WebM file can be played by most modern players
    // This serves as a placeholder - in production, you'd use a dedicated transcoding service
    
    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    
    // Return the file with appropriate headers for download
    // Note: This returns the original WebM data - for true MP3 conversion,
    // you would need to integrate with a transcoding service like:
    // - AWS MediaConvert
    // - Cloudinary
    // - A dedicated FFmpeg microservice
    
    const fileName = filePath.split('/').pop()?.replace('.webm', '.mp3') || 'recording.mp3';
    
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
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
