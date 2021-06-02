TRUNCATE TABLE users, strategy, stock ;

INSERT INTO users (id, user_name, full_name, password, nickname, date_created)
VALUES
  (1,'TestAccount','Testy Testofferson','$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2',NULL,'2020-09-04 16:44:43'),
  (2,'drbretto','Is The Greatest','$2a$12$bRUxowdxGefsLvVZZEa9Gugf7srbIePKAmPEJL6mdjAJ/OJuzdz0.','Nickname','2020-09-04 19:02:53'),
  (3, 'Demo', 'Demo', '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 'Demo', '2020-09-04 19:02:53');

INSERT INTO strategy (id, title, date_published, author_id)
VALUES 
  (1, 'strategy numero uno', '2016-01-16 12:00:00', '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2'),
  (2, 'Second Attempt at a strategy', '2016-01-16 12:00:00', '$2a$12$bRUxowdxGefsLvVZZEa9Gugf7srbIePKAmPEJL6mdjAJ/OJuzdz0.'),
  (3, 'third times a charm', '2016-01-16 12:00:00', '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2'),
  (12, 'My First Strategy', '2020-09-27 11:01:25', '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6'),
  (13, 'An Alternative Approach', '2020-09-27 11:12:43', '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6');

INSERT INTO stock ( id, ticker, industry, shares, price, eps1, color, yield, author_id, strategy_id, date_published)
VALUES
  (1, 'MSFT', 'Technology', 40, 280.51, 1.15,'#0088FE', 5.18, '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2', 1, '2016-01-16 12:00:00'),
  (2, 'TRQ', 'Materials', 1000, 4.54, 5.76, '#FFBB28', 0.90, '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2', 1, '2016-01-16 12:00:00'),
  (3, 'TSLA', 'Automotive', 20, 480.94, 8.82,'#FF8042', 3.61, '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2', 3, '2016-01-16 12:00:00'), 
  (4, 'APL', 'Fruit', 20, 500, 2.13, '#407294', 3.31, '$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2', 3, '2016-01-16 12:00:00'),  
  (5, 'BUTT', 'Technology', 10, 60.90,  0.05, '#ff7373', 1.76, '$2a$12$bRUxowdxGefsLvVZZEa9Gugf7srbIePKAmPEJL6mdjAJ/OJuzdz0.', 2, '2016-01-16 12:00:00'), 
  (6, 'STUFF', 'Materials', 35, 90.60, 1.64, '#ffa500', 6.98, '$2a$12$bRUxowdxGefsLvVZZEa9Gugf7srbIePKAmPEJL6mdjAJ/OJuzdz0.', 2, '2016-01-16 12:00:00'), 
  (7, 'STONK', 'Technology', 37, 3.14, -4.71, '#FF8042', 3.02, '$2a$12$bRUxowdxGefsLvVZZEa9Gugf7srbIePKAmPEJL6mdjAJ/OJuzdz0.', 2, '2016-01-16 12:00:00'),
  (37,'STOR', 'REIT', 10, 26.82, 1.2357,'#ff9a00', 5.3691,'$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 12, '2020-09-27 11:04:32'),
  (38,'MSFT', 'Technology', 10, 207.82, 5.8188,'#81d8d0', 1.0779, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 12, '2020-09-27 11:07:20'),
  (39,'MMM', 'Materials', 10, 160.27,  7.9203,'#696966', 3.668, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 12, '2020-09-27 11:08:28'),
  (40,'KO', 'Consumer Staples', 10, 48.72,2.0861,'#000080', 3.662, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 12, '2020-09-27 11:09:32'),
  (41,'AWR', 'Utilities', 10, 73.84, 1.708, '#004444', 10.5033, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 12, '2020-09-27 11:12:05'),
  (42,'TEST', 'Testing', 100, 50, 1.8, '#800000', 3.5, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 13, '2020-09-27 11:13:16'),
  (43,'AAPL', 'Food', 10, 500, 1.8, '#576675', 4.5, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 13, '2020-09-27 11:13:47'),
  (44,'WORD', 'Education', 1000, 10,3.9,'#f47835', 7, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 13, '2020-09-27 11:14:57'),  
  (45,'NEW', 'Novelties', 250, 40, 15,'#ffb6c1', 9, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 13, '2020-09-27 11:15:49'),
  (46,'PRPL', 'Color', 400, 15, 3, '#9900ef', 15, '$2a$12$nWn9FFfvnRYRPeV7nWej.uGITxh347TMwIicz0Y9CkOPvTexO.HM6', 13, '2020-09-27 11:16:26');
