<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="model.Producto" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Productos - Fábrica de Bocadillos</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #f4f6f9;
            color: #333;
            padding: 30px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 25px;
            text-align: center;
        }
        .card {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 30px;
        }
        .card h2 {
            color: #34495e;
            font-size: 1.25rem;
            margin-bottom: 20px;
            border-bottom: 2px solid #eef2f5;
            padding-bottom: 10px;
        }
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
        }
        .form-group label {
            font-weight: 600;
            margin-bottom: 6px;
            font-size: 0.9rem;
            color: #555;
        }
        .form-group input {
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-group input:focus {
            border-color: #27ae60;
        }
        .btn-submit {
            background-color: #27ae60;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
        }
        .btn-submit:hover {
            background-color: #219150;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            overflow: hidden;
            border-radius: 6px;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #34495e;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #f1f4f8;
        }
        td {
            border-bottom: 1px solid #eef2f5;
            font-size: 0.95rem;
        }
        .empty-msg {
            text-align: center;
            color: #7f8c8d;
            padding: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Gestión de Productos - Fábrica de Bocadillos</h1>

    <!-- Formulario de Registro -->
    <div class="card">
        <h2>Registrar Nuevo Bocadillo</h2>
        <form action="productos" method="POST">
            <div class="form-grid">
                <div class="form-group">
                    <label for="nombre">Nombre del Producto:</label>
                    <input type="text" id="nombre" name="nombre" placeholder="Ej. Bocadillo Veleño" required>
                </div>
                <div class="form-group">
                    <label for="precio">Precio ($):</label>
                    <input type="number" step="0.01" id="precio" name="precio" placeholder="Ej. 2500" required>
                </div>
                <div class="form-group">
                    <label for="stock">Stock Disponible:</label>
                    <input type="number" id="stock" name="stock" placeholder="Ej. 50" required>
                </div>
            </div>
            <button type="submit" class="btn-submit">Guardar Producto</button>
        </form>
    </div>

    <!-- Lista de Productos -->
    <div class="card">
        <h2>Lista de Productos Disponibles</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                <% 
                    List<Producto> lista = (List<Producto>) request.getAttribute("listaProductos");
                    if (lista != null && !lista.isEmpty()) {
                        for (Producto p : lista) {
                %>
                <tr>
                    <td><%= p.getId() %></td>
                    <td><%= p.getNombre() %></td>
                    <td>$<%= String.format("%.2f", p.getPrecio()) %></td>
                    <td><%= p.getStock() %> unidades</td>
                </tr>
                <% 
                        }
                    } else {
                %>
                <tr>
                    <td colspan="4" class="empty-msg">No hay productos registrados aún.</td>
                </tr>
                <% } %>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>