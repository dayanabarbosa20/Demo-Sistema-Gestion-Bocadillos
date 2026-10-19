// js/main.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de Gestión Integral - Módulos de interacción listos.");

    // 1. MENÚ RESPONSIVO (Abre y cierra el menú lateral en pantallas móviles)
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    // 2. INTERACTIVIDAD EN EL LOGIN (Control del icono del ojo para la contraseña)
    const visibilityIcon = document.querySelector(".visibility-icon");
    const passwordField = document.getElementById("password");
    
    if (visibilityIcon && passwordField) {
        visibilityIcon.addEventListener("click", () => {
            const isPassword = passwordField.type === "password";
            passwordField.type = isPassword ? "text" : "password";
            // Cambia el icono visualmente al revelar
            visibilityIcon.textContent = isPassword ? "visibility_off" : "visibility";
        });
    }

    // 3. RETROALIMENTACIÓN DE ACCIONES CRUD (Simulación de alertas con JavaScript)
    // Captura los clics en los botones de "Nuevo Lote", "Editar", "Eliminar" de las tablas
    const actionButtons = document.querySelectorAll(".crud-buttons .btn, .btn-logout-confirm, .btn-logout-cancel");
    
    actionButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Si es el botón de cerrar sesión o cancelar, dejamos que haga su acción de navegación
            if(button.classList.contains('btn-logout-confirm') || button.classList.contains('btn-logout-cancel')) return;

            const accionTxt = button.textContent.trim();
            showCustomToast(`Acción: "${accionTxt}" procesada correctamente.`, "success");
        });
    });

    // Función para crear notificaciones emergentes dinámicas desde JavaScript
    function showCustomToast(message, type) {
        const existingToast = document.querySelector(".js-toast");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.className = `js-toast alert-${type}`;
        
        // Estilos rápidos para que se vea elegante en la esquina superior derecha
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "12px 25px";
        toast.style.borderRadius = "4px";
        toast.style.color = "#ffffff";
        toast.style.fontWeight = "500";
        toast.style.zIndex = "9999";
        toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        toast.style.backgroundColor = type === "success" ? "#11592F" : "#BD1C1C"; // Verde o Rojo corporativo
        
        toast.textContent = message;
        document.body.appendChild(toast);

        // Se desvanece solo a los 3 segundos
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});