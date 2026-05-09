-- Seed Data for MoreArt Mag
-- Insertion de deux pièces pour la Room Preview
INSERT INTO public.room_presets (
    slug, 
    name, 
    description, 
    image_url, 
    thumbnail_url, 
    wall_polygon, 
    wall_width_cm, 
    wall_height_cm, 
    floor_height_normalized,
    category,
    featured,
    sort_order
) VALUES 
(
    'salon-minimaliste',
    'Salon Minimaliste',
    'Un salon épuré avec un grand mur blanc, idéal pour les œuvres panoramiques.',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400',
    '{"points": [[0.2, 0.1], [0.8, 0.1], [0.8, 0.7], [0.2, 0.7]]}', -- Coordonnées normalisées [x,y] du mur
    400, -- 4 mètres de large
    250, -- 2.5 mètres de haut
    0.85,
    'salon',
    true,
    1
),
(
    'chambre-douceur',
    'Chambre Douceur',
    'Une chambre aux tons chauds pour tester l''intégration des œuvres dans une ambiance intime.',
    'https://images.unsplash.com/photo-1616594192358-af7e3d937a2e?q=80&w=2000',
    'https://images.unsplash.com/photo-1616594192358-af7e3d937a2e?q=80&w=400',
    '{"points": [[0.3, 0.2], [0.7, 0.2], [0.7, 0.6], [0.3, 0.6]]}',
    300,
    220,
    0.8,
    'chambre',
    true,
    2
) ON CONFLICT (slug) DO NOTHING;
