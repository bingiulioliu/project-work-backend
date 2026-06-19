-- ============================================================
-- COLLEGAMENTI category_product (per slug)
-- ============================================================
INSERT INTO `category_product` (`product_id`, `category_id`)
SELECT p.id, c.id
FROM (
    SELECT 'spada-dei-mille-inverni' AS product_slug, 'armi' AS category_slug
    UNION ALL SELECT 'spada-dei-mille-inverni', 'per-guerrieri'
    UNION ALL SELECT 'spada-dei-mille-inverni', 'idea-regalo'
    UNION ALL SELECT 'spada-dei-mille-inverni', 'consigliato-dalla-gilda'
    UNION ALL SELECT 'spada-dei-mille-inverni', 'approvato-dal-master'

    UNION ALL SELECT 'mantello-viandante-silenzioso', 'equipaggiamento'
    UNION ALL SELECT 'mantello-viandante-silenzioso', 'accessori'
    UNION ALL SELECT 'mantello-viandante-silenzioso', 'sopravvivenza'

    UNION ALL SELECT 'pozione-cura-maggiore', 'consumabili'
    UNION ALL SELECT 'pozione-cura-maggiore', 'essenziali'
    UNION ALL SELECT 'pozione-cura-maggiore', 'sopravvivenza'
    UNION ALL SELECT 'pozione-cura-maggiore', 'cura-dell-avventuriero'
    UNION ALL SELECT 'pozione-cura-maggiore', 'kit-per-principianti'
    UNION ALL SELECT 'pozione-cura-maggiore', 'imperdibili'
    UNION ALL SELECT 'pozione-cura-maggiore', 'sconti-del-mercante'

    UNION ALL SELECT 'anello-eco-stellare', 'accessori'
    UNION ALL SELECT 'anello-eco-stellare', 'reliquie'
    UNION ALL SELECT 'anello-eco-stellare', 'edizione-limitata'
    UNION ALL SELECT 'anello-eco-stellare', 'idea-regalo'
    UNION ALL SELECT 'anello-eco-stellare', 'per-maghi'
    UNION ALL SELECT 'anello-eco-stellare', 'approvato-dal-master'
    UNION ALL SELECT 'anello-eco-stellare', 'imperdibili'

    UNION ALL SELECT 'scudo-pancione-ferro', 'equipaggiamento'
    UNION ALL SELECT 'scudo-pancione-ferro', 'per-guerrieri'
    UNION ALL SELECT 'scudo-pancione-ferro', 'consigliato-dalla-gilda'

    UNION ALL SELECT 'stivali-passo-felpato', 'equipaggiamento'
    UNION ALL SELECT 'stivali-passo-felpato', 'accessori'
    UNION ALL SELECT 'stivali-passo-felpato', 'kit-per-principianti'
    UNION ALL SELECT 'stivali-passo-felpato', 'sconti-del-mercante'

    UNION ALL SELECT 'bastone-mago-distratto', 'armi'
    UNION ALL SELECT 'bastone-mago-distratto', 'per-maghi'
    UNION ALL SELECT 'bastone-mago-distratto', 'testato-sui-goblin'

    UNION ALL SELECT 'elmo-coraggio-apparente', 'equipaggiamento'
    UNION ALL SELECT 'elmo-coraggio-apparente', 'per-guerrieri'
    UNION ALL SELECT 'elmo-coraggio-apparente', 'idea-regalo'

    UNION ALL SELECT 'amuleto-ritardo-cronico', 'accessori'
    UNION ALL SELECT 'amuleto-ritardo-cronico', 'reliquie'
    UNION ALL SELECT 'amuleto-ritardo-cronico', 'idea-regalo'
    UNION ALL SELECT 'amuleto-ritardo-cronico', 'edizione-limitata'

    UNION ALL SELECT 'arco-mira-quasi-perfetta', 'armi'
    UNION ALL SELECT 'arco-mira-quasi-perfetta', 'per-guerrieri'
    UNION ALL SELECT 'arco-mira-quasi-perfetta', 'testato-sui-goblin'

    UNION ALL SELECT 'bastone-da-scalata', 'equipaggiamento'
    UNION ALL SELECT 'bastone-da-scalata', 'sopravvivenza'
    UNION ALL SELECT 'bastone-da-scalata', 'per-il-riposo-eterno'

    UNION ALL SELECT 'elisir-viso-senza-eta', 'consumabili'
    UNION ALL SELECT 'elisir-viso-senza-eta', 'cura-dell-avventuriero'
    UNION ALL SELECT 'elisir-viso-senza-eta', 'vita-quotidiana'
    UNION ALL SELECT 'elisir-viso-senza-eta', 'idea-regalo'

    UNION ALL SELECT 'crema-solare-abbronzatura-divina', 'consumabili'
    UNION ALL SELECT 'crema-solare-abbronzatura-divina', 'vita-quotidiana'
    UNION ALL SELECT 'crema-solare-abbronzatura-divina', 'cura-dell-avventuriero'
    UNION ALL SELECT 'crema-solare-abbronzatura-divina', 'essenziali'
    UNION ALL SELECT 'crema-solare-abbronzatura-divina', 'idea-regalo'

    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'accessori'
    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'vita-quotidiana'
    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'sopravvivenza'
    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'essenziali'
    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'per-programmatori'
    UNION ALL SELECT 'borraccia-acqua-sempre-tiepida', 'ultimi-arrivi'

    UNION ALL SELECT 'cappello-cilindro-mago-improvvisato', 'accessori'
    UNION ALL SELECT 'cappello-cilindro-mago-improvvisato', 'per-maghi'
    UNION ALL SELECT 'cappello-cilindro-mago-improvvisato', 'idea-regalo'
    UNION ALL SELECT 'cappello-cilindro-mago-improvvisato', 'vita-quotidiana'
    UNION ALL SELECT 'cappello-cilindro-mago-improvvisato', 'ultimi-arrivi'

    UNION ALL SELECT 'calzini-resistenza-infinita', 'accessori'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'vita-quotidiana'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'essenziali'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'kit-per-principianti'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'per-programmatori'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'sconti-del-mercante'
    UNION ALL SELECT 'calzini-resistenza-infinita', 'ultimi-arrivi'

    UNION ALL SELECT 'frusta-domatore-pacioccone', 'armi'
    UNION ALL SELECT 'frusta-domatore-pacioccone', 'per-guerrieri'
    UNION ALL SELECT 'frusta-domatore-pacioccone', 'testato-sui-goblin'
    UNION ALL SELECT 'frusta-domatore-pacioccone', 'ultimi-arrivi'

    UNION ALL SELECT 'specchio-verita-scomoda', 'accessori'
    UNION ALL SELECT 'specchio-verita-scomoda', 'reliquie'
    UNION ALL SELECT 'specchio-verita-scomoda', 'idea-regalo'
    UNION ALL SELECT 'specchio-verita-scomoda', 'per-programmatori'
    UNION ALL SELECT 'specchio-verita-scomoda', 'ultimi-arrivi'

    UNION ALL SELECT 'corno-guerra-risveglio-improvviso', 'equipaggiamento'
    UNION ALL SELECT 'corno-guerra-risveglio-improvviso', 'sopravvivenza'
    UNION ALL SELECT 'corno-guerra-risveglio-improvviso', 'per-guerrieri'
    UNION ALL SELECT 'corno-guerra-risveglio-improvviso', 'ultimi-arrivi'

    UNION ALL SELECT 'corona-re-per-un-giorno', 'accessori'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'reliquie'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'edizione-limitata'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'idea-regalo'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'consigliato-dalla-gilda'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'approvato-dal-master'
    UNION ALL SELECT 'corona-re-per-un-giorno', 'ultimi-arrivi'
) AS map
JOIN `products` p ON p.slug = map.product_slug
JOIN `categories` c ON c.slug = map.category_slug;