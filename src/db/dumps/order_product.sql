-- ============================================================
-- 2. Prodotto-ordine
-- ============================================================
INSERT INTO `order_product` (`order_id`, `product_id`, `quantity`, `price`)
SELECT o.id, p.id, map.quantity, map.price
FROM (
    SELECT 'ORD-0001' AS order_number, 'spada-dei-mille-inverni' AS product_slug, 1 AS quantity, 249.90 AS price
    UNION ALL SELECT 'ORD-0001', 'pozione-cura-maggiore', 3, 9.90

    UNION ALL SELECT 'ORD-0002', 'mantello-viandante-silenzioso', 1, 79.90
    UNION ALL SELECT 'ORD-0002', 'calzini-resistenza-infinita', 2, 8.90

    UNION ALL SELECT 'ORD-0003', 'anello-eco-stellare', 1, 329.00

    UNION ALL SELECT 'ORD-0004', 'scudo-pancione-ferro', 1, 89.50
    UNION ALL SELECT 'ORD-0004', 'elmo-coraggio-apparente', 1, 59.90
    UNION ALL SELECT 'ORD-0004', 'stivali-passo-felpato', 1, 34.90

    UNION ALL SELECT 'ORD-0005', 'bastone-mago-distratto', 1, 219.00
    UNION ALL SELECT 'ORD-0005', 'pozione-cura-maggiore', 5, 9.90

    UNION ALL SELECT 'ORD-0006', 'amuleto-ritardo-cronico', 1, 299.00
    UNION ALL SELECT 'ORD-0006', 'specchio-verita-scomoda', 1, 64.90

    UNION ALL SELECT 'ORD-0007', 'arco-mira-quasi-perfetta', 1, 189.90
    UNION ALL SELECT 'ORD-0007', 'frusta-domatore-pacioccone', 1, 49.90
    UNION ALL SELECT 'ORD-0007', 'corno-guerra-risveglio-improvviso', 1, 44.90

    UNION ALL SELECT 'ORD-0008', 'elisir-viso-senza-eta', 2, 69.90
    UNION ALL SELECT 'ORD-0008', 'crema-solare-abbronzatura-divina', 3, 14.90

    UNION ALL SELECT 'ORD-0009', 'bastone-da-scalata', 1, 149.00
    UNION ALL SELECT 'ORD-0009', 'borraccia-acqua-sempre-tiepida', 1, 12.90
    UNION ALL SELECT 'ORD-0009', 'cappello-cilindro-mago-improvvisato', 1, 24.90

    UNION ALL SELECT 'ORD-0010', 'corona-re-per-un-giorno', 1, 349.00
    UNION ALL SELECT 'ORD-0010', 'calzini-resistenza-infinita', 4, 8.90
) AS map
JOIN `orders` o ON o.order_number = map.order_number
JOIN `products` p ON p.slug = map.product_slug;