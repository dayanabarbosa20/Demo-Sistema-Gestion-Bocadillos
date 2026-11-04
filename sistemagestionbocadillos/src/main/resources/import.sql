CREATE TABLE IF NOT EXISTS productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    precio REAL,
    estado TEXT DEFAULT 'Activo',
    cantidad INTEGER
);

CREATE TABLE IF NOT EXISTS pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    fecha TEXT NOT NULL,
    total NUMERIC NOT NULL DEFAULT 0.00,
    estado TEXT DEFAULT 'Pendiente'
);

CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    telefono TEXT,
    correo TEXT,
    estado TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'Operario',
    estado TEXT DEFAULT 'Activo',
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produccion (
    id_produccion INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_lote TEXT,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    fecha TEXT NOT NULL,
    estado TEXT,
    CONSTRAINT fk_produccion_productos FOREIGN KEY (id_producto)
        REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario (
    id_inventario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    estado TEXT DEFAULT 'Disponible',
    CONSTRAINT fk_inventario_productos FOREIGN KEY (id_producto)
        REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_productos FOREIGN KEY (id_producto)
        REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS fk_detalle_pedido ON detalle_pedido (id_pedido);
CREATE INDEX IF NOT EXISTS fk_detalle_productos ON detalle_pedido (id_producto);
CREATE INDEX IF NOT EXISTS fk_inventario_productos ON inventario (id_producto);
CREATE INDEX IF NOT EXISTS fk_produccion_productos ON produccion (id_producto);

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
