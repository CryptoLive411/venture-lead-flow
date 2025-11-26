-- Create storage bucket for player images
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-images', 'player-images', true);

-- Create RLS policies for player images bucket
CREATE POLICY "Anyone can upload player images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'player-images');

CREATE POLICY "Player images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-images');