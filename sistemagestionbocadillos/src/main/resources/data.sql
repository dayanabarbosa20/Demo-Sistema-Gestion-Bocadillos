INSERT INTO productos (id_producto, nombre, precio, estado, cantidad) VALUES
(1, 'Panelitas', 3500, 'Activo', NULL),
(3, 'Bocadillo veleño', 4500, 'Activo', NULL),
(4, 'Guacamaya', 4500, 'Activo', NULL),
(5, 'Herpus', 5500, 'Activo', NULL),
(6, 'Lonja', 5250, 'Activo', NULL)
ON CONFLICT (id_producto) DO NOTHING;

INSERT INTO proveedor (id_proveedor, nombre, telefono, correo, estado) VALUES
(1, 'Lacteos el Valle', '3171234567', 'Contacto@lacteoselvalle.com', 'Activo')
ON CONFLICT (id_proveedor) DO NOTHING;

INSERT INTO produccion (id_produccion, codigo_lote, id_producto, cantidad, fecha, estado) VALUES
(3, 'P001', 5, 345, '2026-10-21', 'Pendiente'),
(4, 'P001', 5, 232, '2026-10-20', 'En proceso')
ON CONFLICT (id_produccion) DO NOTHING;

SELECT setval(pg_get_serial_sequence('productos', 'id_producto'), COALESCE(max(id_producto), 1)) FROM productos;
SELECT setval(pg_get_serial_sequence('proveedor', 'id_proveedor'), COALESCE(max(id_proveedor), 1)) FROM proveedor;
SELECT setval(pg_get_serial_sequence('produccion', 'id_produccion'), COALESCE(max(id_produccion), 1)) FROM produccion;