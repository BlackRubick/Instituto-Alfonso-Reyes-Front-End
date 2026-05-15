#!/bin/bash

# Instituto Alfonso Reyes - Quick Start Script

echo "========================================"
echo "Instituto Alfonso Reyes Virtual"
echo "Iniciando servidor de desarrollo..."
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

# Start dev server
echo "🚀 Iniciando servidor en http://localhost:5173"
echo ""
npm run dev
