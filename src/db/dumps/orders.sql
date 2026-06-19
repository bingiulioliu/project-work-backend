-- ============================================================
-- 1. ORDINI
-- ============================================================
INSERT INTO `orders` (`order_number`, `customer_name`, `customer_address`, `customer_city`, `customer_postal_code`, `notes`, `telephone_number`, `mail`, `created_at`, `updated_at`) VALUES
('ORD-0001', 'Marco Rossi', 'Via Roma 12', 'Milano', '20100', 'Consegnare prima delle 18:00, citofono rotto.', '+39 333 1234567', 'marco.rossi@example.com', '2026-01-15 10:23:00', '2026-01-15 10:23:00'),
('ORD-0002', 'Giulia Bianchi', 'Corso Italia 45', 'Torino', '10121', '', '+39 347 7654321', 'giulia.bianchi@example.com', '2026-02-03 14:05:00', '2026-02-03 14:05:00'),
('ORD-0003', 'Luca Verdi', 'Via Garibaldi 8', 'Napoli', '80100', 'Regalo di compleanno, confezionare con cura.', '+39 320 9988776', 'luca.verdi@example.com', '2026-02-20 09:47:00', '2026-02-20 09:47:00'),
('ORD-0004', 'Sara Ferrari', 'Piazza Duomo 3', 'Firenze', '50122', '', '+39 348 1122334', 'sara.ferrari@example.com', '2026-03-05 16:30:00', '2026-03-05 16:30:00'),
('ORD-0005', 'Davide Russo', 'Via Mazzini 21', 'Bologna', '40121', 'Cliente abituale, sconto fedeltà già applicato al totale.', '+39 333 5566778', 'davide.russo@example.com', '2026-03-18 11:12:00', '2026-03-18 11:12:00'),
('ORD-0006', 'Elena Colombo', 'Via Dante 9', 'Palermo', '90133', '', '+39 392 4433221', 'elena.colombo@example.com', '2026-04-02 13:55:00', '2026-04-02 13:55:00'),
('ORD-0007', 'Andrea Bruno', 'Via Veneto 17', 'Roma', '00187', 'Lasciare al portiere se assente.', '+39 366 7788990', 'andrea.bruno@example.com', '2026-04-21 10:08:00', '2026-04-21 10:08:00'),
('ORD-0008', 'Francesca Galli', 'Via Po 5', 'Torino', '10124', '', '+39 339 1029384', 'francesca.galli@example.com', '2026-05-09 15:40:00', '2026-05-09 15:40:00'),
('ORD-0009', 'Matteo Costa', 'Via Etnea 100', 'Catania', '95131', 'Fragile: il cappello a cilindro non sopporta urti.', '+39 327 5647382', 'matteo.costa@example.com', '2026-05-27 12:22:00', '2026-05-27 12:22:00'),
('ORD-0010', 'Chiara Mancini', 'Via Indipendenza 30', 'Bologna', '40121', 'Spedizione express richiesta.', '+39 388 1112223', 'chiara.mancini@example.com', '2026-06-10 17:03:00', '2026-06-10 17:03:00');