-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO `products` (`name`, `slug`, `description`, `price`, `rarity`, `image`, `created_at`, `updated_at`) VALUES
('Spada dei Mille Inverni', 'spada-dei-mille-inverni', 'Forgiata nel ghiaccio eterno del Nord. Taglia, gela e fa anche un freddo cane (letteralmente).', 249.90, 'legendary', 'spada-mille-inverni.jpg', NOW(), NOW()),
('Mantello del Viandante Silenzioso', 'mantello-viandante-silenzioso', 'Ti rende invisibile ai nemici ma non a tua madre che ti chiede sempre dove stai andando.', 79.90, 'rare', 'mantello-viandante.jpg', NOW(), NOW()),
('Pozione di Cura Maggiore', 'pozione-cura-maggiore', 'Sa di lampone scaduto ma ti rimette in piedi più veloce di un caffè doppio il lunedì mattina.', 9.90, 'common', 'pozione-cura-maggiore.jpg', NOW(), NOW()),
('Anello dell''Eco Stellare', 'anello-eco-stellare', 'Raccoglie l''energia delle stelle cadenti. Bolletta della luce di casa non incluse.', 329.00, 'legendary', 'anello-eco-stellare.jpg', NOW(), NOW()),
('Scudo del Pancione di Ferro', 'scudo-pancione-ferro', 'Forgiato per resistere a tutto tranne ai sensi di colpa dopo un''abbuffata al banchetto reale.', 89.50, 'rare', 'scudo-pancione-ferro.jpg', NOW(), NOW()),
('Stivali del Passo Felpato', 'stivali-passo-felpato', 'Non fanno rumore quando cammini, ma scricchiolano in modo imbarazzante quando ti siedi.', 34.90, 'common', 'stivali-passo-felpato.jpg', NOW(), NOW()),
('Bastone del Mago Distratto', 'bastone-mago-distratto', 'Lancia incantesimi potentissimi, il 30% delle volte sul lanciatore stesso. Garanzia non inclusa.', 219.00, 'legendary', 'bastone-mago-distratto.jpg', NOW(), NOW()),
('Elmo del Coraggio Apparente', 'elmo-coraggio-apparente', 'Ti fa sembrare un eroe leggendario. Il coraggio vero resta opzionale e non garantito.', 59.90, 'rare', 'elmo-coraggio-apparente.jpg', NOW(), NOW()),
('Amuleto del Ritardo Cronico', 'amuleto-ritardo-cronico', 'Ti teletrasporta sempre cinque minuti dopo l''orario stabilito. Funziona, in un certo senso.', 299.00, 'legendary', 'amuleto-ritardo-cronico.jpg', NOW(), NOW()),
('Arco della Mira Quasi Perfetta', 'arco-mira-quasi-perfetta', 'Colpisce il bersaglio nove volte su dieci. La decima volta colpisce un barile esplosivo a caso.', 189.90, 'legendary', 'arco-mira-quasi-perfetta.jpg', NOW(), NOW()),
('Bastone da scalata', 'bastone-da-scalata', 'Ti rende la scalata più leggera ma ti fa invecchiare precocemente.', 149.00, 'legendary', 'bastone-da-scalata.jpg', NOW(), NOW()),
('Elisir del Viso Senza Età', 'elisir-viso-senza-eta', 'Promette pelle da elfo eterno. In realtà funziona solo se smetti di dormire 3 ore a notte.', 69.90, 'rare', 'elisir-viso-senza-eta.jpg', NOW(), NOW()),
('Crema Solare dell''Abbronzatura Divina', 'crema-solare-abbronzatura-divina', 'Protegge dai raggi del sole degli dei. Non protegge dal disastro se la dimentichi al sole tre ore.', 14.90, 'common', 'crema-solare-abbronzatura-divina.jpg', NOW(), NOW()),
('Borraccia dell''Acqua Sempre Tiepida', 'borraccia-acqua-sempre-tiepida', 'Non si raffredda mai, non si scalda mai. Perfetta se odi le sorprese, pessima se ami il ghiaccio.', 12.90, 'common', 'borraccia-acqua-tiepida.jpg', NOW(), NOW()),
('Cappello a Cilindro del Mago Improvvisato', 'cappello-cilindro-mago-improvvisato', 'Fa apparire un coniglio dal nulla ogni tanto. A volte compaiono anche dei piccioni, non richiesti.', 24.90, 'common', 'cappello-mago-improvvisato.jpg', NOW(), NOW()),
('Calzini della Resistenza Infinita', 'calzini-resistenza-infinita', 'Non si buca mai, non si spaiano mai, tranne quando li metti in lavatrice senza pensarci.', 8.90, 'common', 'calzini-resistenza-infinita.jpg', NOW(), NOW()),
('Frusta del Domatore Pacioccone', 'frusta-domatore-pacioccone', 'Doma le bestie più feroci con un solo schiocco gentile. Sulle persone l''effetto è puramente decorativo.', 49.90, 'rare', 'frusta-domatore-pacioccone.jpg', NOW(), NOW()),
('Specchio della Verità Scomoda', 'specchio-verita-scomoda', 'Ti dice sempre la verità, anche quando chiedi solo come stai oggi.', 64.90, 'rare', 'specchio-verita-scomoda.jpg', NOW(), NOW()),
('Corno da Guerra del Risveglio Improvviso', 'corno-guerra-risveglio-improvviso', 'Sveglia un intero accampamento in un istante. Anche quello nemico, a tre valli di distanza.', 44.90, 'rare', 'corno-risveglio-improvviso.jpg', NOW(), NOW()),
('Corona del Re per un Giorno', 'corona-re-per-un-giorno', 'Ti rende sovrano assoluto per ventiquattro ore esatte. Le tasse arretrate restano comunque tue.', 349.00, 'legendary', 'corona-re-un-giorno.jpg', NOW(), NOW());


SET SQL_SAFE_UPDATES = 0;

UPDATE products
SET image = REPLACE(image, '.jpg', '.png')
WHERE image LIKE '%.jpg';

SET SQL_SAFE_UPDATES = 1;


-- ============================================================
-- Seconda trance prodotti 30
-- ============================================================
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `rarity`, `image`, `created_at`, `updated_at`) VALUES
('Pugnale del Lancio Sfortunato', 'pugnale-lancio-sfortunato', 'Veloce e affilato, vola dritto verso il bersaglio. Poi rimbalza e torna sempre verso di te, con precisione preoccupante.', 29.90, 'common', 'pugnale-lancio-sfortunato.png', NOW(), NOW()),
('Tappeto Volante di Seconda Mano', 'tappeto-volante-seconda-mano', 'Vola ancora benissimo, ignora le piccole macchie di unto e il leggero odore di cammello. Un solo proprietario precedente, un mago molto disordinato.', 159.90, 'rare', 'tappeto-volante-seconda-mano.png', NOW(), NOW()),
('Guanti dell''Artigiano Maldestro', 'guanti-artigiano-maldestro', 'Ti fanno sembrare un abile fabbro esperto. I pollici restano comunque due, ma sembrano sempre quello sbagliato.', 16.90, 'common', 'guanti-artigiano-maldestro.png', NOW(), NOW()),
('Pergamena della Scusa Perfetta', 'pergamena-scusa-perfetta', 'Genera una giustificazione credibile per qualsiasi ritardo o disastro. Non funziona due volte con la stessa persona, purtroppo.', 39.90, 'rare', 'pergamena-scusa-perfetta.png', NOW(), NOW()),
('Lanterna della Notte Eterna', 'lanterna-notte-eterna', 'Illumina anche le caverne più buie e i dungeon più cupi. Attira però ogni insetto luminoso nel raggio di tre leghe.', 54.90, 'rare', 'lanterna-notte-eterna.png', NOW(), NOW()),
('Zaino dello Spazio Infinito', 'zaino-spazio-infinito', 'Contiene tutto ciò che ti serve e molto altro. Ritrovare le chiavi al suo interno richiede però una spedizione a parte.', 279.00, 'legendary', 'zaino-spazio-infinito.png', NOW(), NOW()),
('Bussola del Senso dell''Orientamento', 'bussola-senso-orientamento', 'Punta sempre verso nord, tranne quando ne hai davvero bisogno. In quei casi indica la taverna più vicina.', 19.90, 'common', 'bussola-senso-orientamento.png', NOW(), NOW()),
('Tamburo del Ritmo Inarrestabile', 'tamburo-ritmo-inarrestabile', 'Dà la carica a tutta la compagnia prima della battaglia. Continua a suonare da solo anche quando vorresti dormire.', 42.90, 'rare', 'tamburo-ritmo-inarrestabile.png', NOW(), NOW()),
('Occhiali della Visione Selettiva', 'occhiali-visione-selettiva', 'Ti permettono di vedere solo ciò che vuoi vedere. Stranamente i compiti da fare restano sempre perfettamente visibili.', 22.90, 'common', 'occhiali-visione-selettiva.png', NOW(), NOW()),
('Flauto dell''Incantatore Stonato', 'flauto-incantatore-stonato', 'Ammalia serpenti e creature magiche con melodie ipnotiche. Sui vicini di accampamento l''effetto è esattamente opposto.', 47.90, 'rare', 'flauto-incantatore-stonato.png', NOW(), NOW()),
('Grimorio degli Incantesimi Autocorretti', 'grimorio-incantesimi-autocorretti', 'Corregge automaticamente i tuoi incantesimi mentre li lanci. A volte la palla di fuoco diventa una pallina di fieno, ma ci pensa lui.', 239.00, 'legendary', 'grimorio-incantesimi-autocorretti.png', NOW(), NOW()),
('Sacco a Pelo del Sonno Profondissimo', 'sacco-pelo-sonno-profondissimo', 'Ti garantisce nove ore di sonno ristoratore ovunque tu sia. Anche durante l''assalto dei goblin, sfortunatamente.', 74.90, 'rare', 'sacco-pelo-sonno-profondissimo.png', NOW(), NOW()),
('Clessidra del Tempo Rubato', 'clessidra-tempo-rubato', 'Regala cinque minuti in più ogni volta che la giri. Quei minuti vengono però sottratti silenziosamente al tuo futuro.', 319.00, 'legendary', 'clessidra-tempo-rubato.png', NOW(), NOW()),
('Balsamo del Barbiere Spericolato', 'balsamo-barbiere-spericolato', 'Rende barba e capelli morbidi e lucenti come quelli di un elfo. Le istruzioni sono scritte in nanico antico, buona fortuna.', 13.90, 'common', 'balsamo-barbiere-spericolato.png', NOW(), NOW()),
('Penna della Firma Reale', 'penna-firma-reale', 'Rende qualsiasi firma elegante e autorevole come quella di un sovrano. Non rende però validi i decreti che firmi di nascosto.', 58.90, 'rare', 'penna-firma-reale.png', NOW(), NOW());

INSERT INTO `products` (`name`, `slug`, `description`, `price`, `rarity`, `image`, `created_at`, `updated_at`) VALUES
('Bastone tra le Ruote', 'bastone-tra-le-ruote', 'Un artefatto temibile che sprigiona il suo vero potere in mano a un Project Manager. Sbattuto a terra durante un SAL, azzera i progressi, cambia improvvisamente tutti i task del party e genera panico ad area.', 199.90, 'legendary', 'bastone-tra-le-ruote.png', NOW(), NOW()),
('Talismano del "Sul Mio Carretto Funzionava"', 'talismano-sul-mio-carretto', 'Protegge l''equipaggiamento da ogni malfunzionamento magico o meccanico. L''effetto svanisce non appena provi a mostrarlo a un membro della gilda o al cliente.', 24.90, 'common', 'talismano-sul-mio-carretto.png', NOW(), NOW()),
('Amuleto del Refactoring Magico', 'amuleto-refactoring-magico', 'Rende i gesti e le formule dei tuoi incantesimi incredibilmente eleganti e leggibili. Peccato che, una volta lanciati, smettano completamente di evocare palle di fuoco.', 145.00, 'rare', 'amuleto-refactoring-magico.png', NOW(), NOW()),
('Pozione della Scadenza Imminente', 'pozione-scadenza-imminente', 'Garantisce un bonus destrezza del 400%, ma si attiva esclusivamente la notte prima della consegna di una quest. Segue inevitabile stato di coma profondo.', 18.90, 'rare', 'pozione-scadenza-imminente.png', NOW(), NOW()),
('Mantello dell''Invisibilità ai Meeting', 'mantello-invisibilita-meeting', 'Ti rende perfettamente invisibile e impercettibile, ma solo nel momento in cui il capo gilda chiede: "Chi si offre volontario per questa missione?".', 89.90, 'legendary', 'mantello-invisibilita-meeting.png', NOW(), NOW()),
('Scudo delle Stime Ottimistiche', 'scudo-stime-ottimistiche', 'Incanala energia positiva facendoti credere che liberare il dungeon richiederà "al massimo mezza giornata". Le spese mediche per le ferite non sono incluse.', 35.00, 'common', 'scudo-stime-ottimistiche.png', NOW(), NOW()),
('Spada del Bug Riproducibile', 'spada-bug-riproducibile', 'Infligge danni devastanti in combattimento, ma solo se colpisci il nemico seguendo una sequenza di passi assurdi che nessun alleato riesce a replicare.', 210.00, 'rare', 'spada-bug-riproducibile.png', NOW(), NOW()),
('Sfera di Cristallo del Senno di Poi', 'sfera-cristallo-senno-di-poi', 'Rivela sempre la strategia perfetta e il punto debole del mostro... esattamente cinque minuti dopo che l''intero party è stato spazzato via.', 65.50, 'rare', 'sfera-cristallo-senno-di-poi.png', NOW(), NOW()),
('Anello del Seniority Fittizio', 'anello-seniority-fittizio', 'Emana un''incantevole aura di immensa competenza. L''illusione svanisce con un sonoro "Pouf!" non appena ti chiedono di spiegare l''architettura del database magico.', 45.90, 'common', 'anello-seniority-fittizio.png', NOW(), NOW()),
('Fiaschetta del Feedback Costruttivo', 'fiaschetta-feedback-costruttivo', 'Chi la beve elargisce preziosi e puntuali consigli al gruppo. Il tono però è così passivo-aggressivo che finiscono tutti per odiarlo comunque.', 29.90, 'common', 'fiaschetta-feedback-costruttivo.png', NOW(), NOW()),
('Stivali del Multitasking Disastroso', 'stivali-multitasking-disastroso', 'Ti permettono di camminare furtivamente, recitare incantesimi e affilare la lama contemporaneamente. Le probabilità di pugnalarti da solo inciampando triplicano.', 55.00, 'rare', 'stivali-multitasking-disastroso.png', NOW(), NOW()),
('Cappello dell''Impostore Eroico', 'cappello-impostore-eroico', 'Ti fa sentire l''avventuriero più scarso del regno, anche se hai appena decapitato un drago con uno stuzzicadenti. Ottimo per coltivare la sindrome dell''impostore.', 32.90, 'common', 'cappello-impostore-eroico.png', NOW(), NOW()),
('Mappa del Tesoro in Agile', 'mappa-tesoro-agile', 'Mostra la via verso l''oro divisa in comodi "sprint" di due settimane. Purtroppo, la X rossa viene spostata dal committente alla fine di ogni iterazione.', 112.90, 'legendary', 'mappa-tesoro-agile.png', NOW(), NOW()),
('Elmo della Feature Aggiuntiva', 'elmo-feature-aggiuntiva', 'Ti obbliga ad abbellire la tua armatura con nappe e rune luminose proprio mentre gli orchi stanno sfondando le mura. Letale, ma incredibilmente stiloso.', 48.00, 'rare', 'elmo-feature-aggiuntiva.png', NOW(), NOW()),
('Pergamena del Copia-Incolla Arcano', 'pergamena-copia-incolla-arcano', 'Copia alla perfezione un potente incantesimo di un mago più esperto. Dato che ne ignori la sintassi, di solito evoca uno stormo di oche inferocite invece di un demone.', 15.90, 'common', 'pergamena-copia-incolla-arcano.png', NOW(), NOW());