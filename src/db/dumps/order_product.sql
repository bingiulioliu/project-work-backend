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


-- ============================================================
-- 2. Associazioni per seconda trance inserimento prodotti
-- ============================================================

INSERT INTO `category_product` (`product_id`, `category_id`)
SELECT p.id, c.id
FROM (
    SELECT 'pugnale-lancio-sfortunato' AS product_slug, 'armi' AS category_slug
    UNION ALL SELECT 'pugnale-lancio-sfortunato', 'per-guerrieri'
    UNION ALL SELECT 'pugnale-lancio-sfortunato', 'testato-sui-goblin'
    UNION ALL SELECT 'pugnale-lancio-sfortunato', 'sconti-del-mercante'
    UNION ALL SELECT 'pugnale-lancio-sfortunato', 'ultimi-arrivi'

    UNION ALL SELECT 'tappeto-volante-seconda-mano', 'equipaggiamento'
    UNION ALL SELECT 'tappeto-volante-seconda-mano', 'sopravvivenza'
    UNION ALL SELECT 'tappeto-volante-seconda-mano', 'idea-regalo'
    UNION ALL SELECT 'tappeto-volante-seconda-mano', 'sconti-del-mercante'
    UNION ALL SELECT 'tappeto-volante-seconda-mano', 'ultimi-arrivi'

    UNION ALL SELECT 'guanti-artigiano-maldestro', 'accessori'
    UNION ALL SELECT 'guanti-artigiano-maldestro', 'kit-per-principianti'
    UNION ALL SELECT 'guanti-artigiano-maldestro', 'vita-quotidiana'
    UNION ALL SELECT 'guanti-artigiano-maldestro', 'sconti-del-mercante'

    UNION ALL SELECT 'pergamena-scusa-perfetta', 'consumabili'
    UNION ALL SELECT 'pergamena-scusa-perfetta', 'essenziali'
    UNION ALL SELECT 'pergamena-scusa-perfetta', 'vita-quotidiana'
    UNION ALL SELECT 'pergamena-scusa-perfetta', 'per-programmatori'
    UNION ALL SELECT 'pergamena-scusa-perfetta', 'idea-regalo'

    UNION ALL SELECT 'lanterna-notte-eterna', 'equipaggiamento'
    UNION ALL SELECT 'lanterna-notte-eterna', 'sopravvivenza'
    UNION ALL SELECT 'lanterna-notte-eterna', 'essenziali'
    UNION ALL SELECT 'lanterna-notte-eterna', 'per-il-riposo-eterno'

    UNION ALL SELECT 'zaino-spazio-infinito', 'equipaggiamento'
    UNION ALL SELECT 'zaino-spazio-infinito', 'reliquie'
    UNION ALL SELECT 'zaino-spazio-infinito', 'edizione-limitata'
    UNION ALL SELECT 'zaino-spazio-infinito', 'idea-regalo'
    UNION ALL SELECT 'zaino-spazio-infinito', 'imperdibili'
    UNION ALL SELECT 'zaino-spazio-infinito', 'approvato-dal-master'
    UNION ALL SELECT 'zaino-spazio-infinito', 'ultimi-arrivi'

    UNION ALL SELECT 'bussola-senso-orientamento', 'accessori'
    UNION ALL SELECT 'bussola-senso-orientamento', 'sopravvivenza'
    UNION ALL SELECT 'bussola-senso-orientamento', 'kit-per-principianti'
    UNION ALL SELECT 'bussola-senso-orientamento', 'essenziali'

    UNION ALL SELECT 'tamburo-ritmo-inarrestabile', 'equipaggiamento'
    UNION ALL SELECT 'tamburo-ritmo-inarrestabile', 'per-guerrieri'
    UNION ALL SELECT 'tamburo-ritmo-inarrestabile', 'consigliato-dalla-gilda'
    UNION ALL SELECT 'tamburo-ritmo-inarrestabile', 'ultimi-arrivi'

    UNION ALL SELECT 'occhiali-visione-selettiva', 'accessori'
    UNION ALL SELECT 'occhiali-visione-selettiva', 'vita-quotidiana'
    UNION ALL SELECT 'occhiali-visione-selettiva', 'per-programmatori'
    UNION ALL SELECT 'occhiali-visione-selettiva', 'idea-regalo'

    UNION ALL SELECT 'flauto-incantatore-stonato', 'armi'
    UNION ALL SELECT 'flauto-incantatore-stonato', 'per-maghi'
    UNION ALL SELECT 'flauto-incantatore-stonato', 'testato-sui-goblin'
    UNION ALL SELECT 'flauto-incantatore-stonato', 'idea-regalo'

    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'reliquie'
    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'per-maghi'
    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'edizione-limitata'
    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'approvato-dal-master'
    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'imperdibili'
    UNION ALL SELECT 'grimorio-incantesimi-autocorretti', 'per-programmatori'

    UNION ALL SELECT 'sacco-pelo-sonno-profondissimo', 'equipaggiamento'
    UNION ALL SELECT 'sacco-pelo-sonno-profondissimo', 'sopravvivenza'
    UNION ALL SELECT 'sacco-pelo-sonno-profondissimo', 'per-il-riposo-eterno'
    UNION ALL SELECT 'sacco-pelo-sonno-profondissimo', 'vita-quotidiana'
    UNION ALL SELECT 'sacco-pelo-sonno-profondissimo', 'idea-regalo'

    UNION ALL SELECT 'clessidra-tempo-rubato', 'reliquie'
    UNION ALL SELECT 'clessidra-tempo-rubato', 'edizione-limitata'
    UNION ALL SELECT 'clessidra-tempo-rubato', 'approvato-dal-master'
    UNION ALL SELECT 'clessidra-tempo-rubato', 'consigliato-dalla-gilda'
    UNION ALL SELECT 'clessidra-tempo-rubato', 'imperdibili'
    UNION ALL SELECT 'clessidra-tempo-rubato', 'idea-regalo'

    UNION ALL SELECT 'balsamo-barbiere-spericolato', 'consumabili'
    UNION ALL SELECT 'balsamo-barbiere-spericolato', 'cura-dell-avventuriero'
    UNION ALL SELECT 'balsamo-barbiere-spericolato', 'vita-quotidiana'
    UNION ALL SELECT 'balsamo-barbiere-spericolato', 'essenziali'
    UNION ALL SELECT 'balsamo-barbiere-spericolato', 'sconti-del-mercante'

    UNION ALL SELECT 'penna-firma-reale', 'accessori'
    UNION ALL SELECT 'penna-firma-reale', 'idea-regalo'
    UNION ALL SELECT 'penna-firma-reale', 'per-programmatori'
    UNION ALL SELECT 'penna-firma-reale', 'edizione-limitata'
    UNION ALL SELECT 'penna-firma-reale', 'ultimi-arrivi'

    -- Bastone tra le Ruote
    UNION ALL SELECT 'bastone-tra-le-ruote', 'reliquie'
    UNION ALL SELECT 'bastone-tra-le-ruote', 'edizione-limitata'
    UNION ALL SELECT 'bastone-tra-le-ruote', 'approvato-dal-master'
    UNION ALL SELECT 'bastone-tra-le-ruote', 'per-programmatori'
    UNION ALL SELECT 'bastone-tra-le-ruote', 'ultimi-arrivi'

    -- Talismano del "Sul Mio Carretto Funzionava"
    UNION ALL SELECT 'talismano-sul-mio-carretto', 'accessori'
    UNION ALL SELECT 'talismano-sul-mio-carretto', 'kit-per-principianti'
    UNION ALL SELECT 'talismano-sul-mio-carretto', 'per-programmatori'
    UNION ALL SELECT 'talismano-sul-mio-carretto', 'sconti-del-mercante'

    -- Amuleto del Refactoring Magico
    UNION ALL SELECT 'amuleto-refactoring-magico', 'accessori'
    UNION ALL SELECT 'amuleto-refactoring-magico', 'per-maghi'
    UNION ALL SELECT 'amuleto-refactoring-magico', 'per-programmatori'
    UNION ALL SELECT 'amuleto-refactoring-magico', 'imperdibili'

    -- Pozione della Scadenza Imminente
    UNION ALL SELECT 'pozione-scadenza-imminente', 'consumabili'
    UNION ALL SELECT 'pozione-scadenza-imminente', 'sopravvivenza'
    UNION ALL SELECT 'pozione-scadenza-imminente', 'vita-quotidiana'
    UNION ALL SELECT 'pozione-scadenza-imminente', 'per-programmatori'

    -- Mantello dell'Invisibilità ai Meeting
    UNION ALL SELECT 'mantello-invisibilita-meeting', 'equipaggiamento'
    UNION ALL SELECT 'mantello-invisibilita-meeting', 'reliquie'
    UNION ALL SELECT 'mantello-invisibilita-meeting', 'edizione-limitata'
    UNION ALL SELECT 'mantello-invisibilita-meeting', 'idea-regalo'
    UNION ALL SELECT 'mantello-invisibilita-meeting', 'per-programmatori'

    -- Scudo delle Stime Ottimistiche
    UNION ALL SELECT 'scudo-stime-ottimistiche', 'equipaggiamento'
    UNION ALL SELECT 'scudo-stime-ottimistiche', 'per-guerrieri'
    UNION ALL SELECT 'scudo-stime-ottimistiche', 'kit-per-principianti'
    UNION ALL SELECT 'scudo-stime-ottimistiche', 'sconti-del-mercante'

    -- Spada del Bug Riproducibile
    UNION ALL SELECT 'spada-bug-riproducibile', 'armi'
    UNION ALL SELECT 'spada-bug-riproducibile', 'per-guerrieri'
    UNION ALL SELECT 'spada-bug-riproducibile', 'testato-sui-goblin'
    UNION ALL SELECT 'spada-bug-riproducibile', 'per-programmatori'

    -- Sfera di Cristallo del Senno di Poi
    UNION ALL SELECT 'sfera-cristallo-senno-di-poi', 'equipaggiamento'
    UNION ALL SELECT 'sfera-cristallo-senno-di-poi', 'per-maghi'
    UNION ALL SELECT 'sfera-cristallo-senno-di-poi', 'consigliato-dalla-gilda'
    UNION ALL SELECT 'sfera-cristallo-senno-di-poi', 'idea-regalo'

    -- Anello del Seniority Fittizio
    UNION ALL SELECT 'anello-seniority-fittizio', 'accessori'
    UNION ALL SELECT 'anello-seniority-fittizio', 'vita-quotidiana'
    UNION ALL SELECT 'anello-seniority-fittizio', 'per-programmatori'
    UNION ALL SELECT 'anello-seniority-fittizio', 'sconti-del-mercante'

    -- Fiaschetta del Feedback Costruttivo
    UNION ALL SELECT 'fiaschetta-feedback-costruttivo', 'equipaggiamento'
    UNION ALL SELECT 'fiaschetta-feedback-costruttivo', 'cura-dell-avventuriero'
    UNION ALL SELECT 'fiaschetta-feedback-costruttivo', 'vita-quotidiana'
    UNION ALL SELECT 'fiaschetta-feedback-costruttivo', 'sconti-del-mercante'

    -- Stivali del Multitasking Disastroso
    UNION ALL SELECT 'stivali-multitasking-disastroso', 'equipaggiamento'
    UNION ALL SELECT 'stivali-multitasking-disastroso', 'sopravvivenza'
    UNION ALL SELECT 'stivali-multitasking-disastroso', 'vita-quotidiana'

    -- Cappello dell'Impostore Eroico
    UNION ALL SELECT 'cappello-impostore-eroico', 'accessori'
    UNION ALL SELECT 'cappello-impostore-eroico', 'kit-per-principianti'
    UNION ALL SELECT 'cappello-impostore-eroico', 'per-programmatori'
    UNION ALL SELECT 'cappello-impostore-eroico', 'sconti-del-mercante'

    -- Mappa del Tesoro in Agile
    UNION ALL SELECT 'mappa-tesoro-agile', 'equipaggiamento'
    UNION ALL SELECT 'mappa-tesoro-agile', 'reliquie'
    UNION ALL SELECT 'mappa-tesoro-agile', 'edizione-limitata'
    UNION ALL SELECT 'mappa-tesoro-agile', 'approvato-dal-master'
    UNION ALL SELECT 'mappa-tesoro-agile', 'per-programmatori'
    UNION ALL SELECT 'mappa-tesoro-agile', 'ultimi-arrivi'

    -- Elmo della Feature Aggiuntiva
    UNION ALL SELECT 'elmo-feature-aggiuntiva', 'equipaggiamento'
    UNION ALL SELECT 'elmo-feature-aggiuntiva', 'per-guerrieri'
    UNION ALL SELECT 'elmo-feature-aggiuntiva', 'imperdibili'
    UNION ALL SELECT 'elmo-feature-aggiuntiva', 'per-programmatori'

    -- Pergamena del Copia-Incolla Arcano
    UNION ALL SELECT 'pergamena-copia-incolla-arcano', 'consumabili'
    UNION ALL SELECT 'pergamena-copia-incolla-arcano', 'per-maghi'
    UNION ALL SELECT 'pergamena-copia-incolla-arcano', 'kit-per-principianti'
    UNION ALL SELECT 'pergamena-copia-incolla-arcano', 'per-programmatori'
    UNION ALL SELECT 'pergamena-copia-incolla-arcano', 'sconti-del-mercante'
) AS map
JOIN `products` p ON p.slug = map.product_slug
JOIN `categories` c ON c.slug = map.category_slug;