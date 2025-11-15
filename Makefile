.PHONY: dev build up down migrate migrate-twitter migrate-telegram logs clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev              - Start the entire development environment (migrate + up)"
	@echo "  make build            - Build all Docker images"
	@echo "  make up               - Start all services"
	@echo "  make down             - Stop all services"
	@echo "  make migrate          - Migrate all CSV data to PostgreSQL"
	@echo "  make migrate-telegram - Migrate only Telegram CSV data"
	@echo "  make migrate-twitter  - Migrate only Twitter CSV data"
	@echo "  make logs             - View logs from all services"
	@echo "  make clean            - Remove all containers, volumes, and images"

# Start development environment with migration
dev:
	@echo "🚀 Starting development environment..."
	@make build
	@make up
	@echo "⏳ Waiting for database to be ready..."
	@sleep 5
	@make migrate
	@echo "✅ Development environment is ready!"
	@echo "📊 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:5000"
	@echo "🗄️  PostgreSQL: localhost:5432"

# Build all Docker images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "⬆️  Starting services..."
	docker-compose up -d
	@echo "✅ Services started!"

# Stop all services
down:
	@echo "⬇️  Stopping services..."
	docker-compose down
	@echo "✅ Services stopped!"

# Migrate all CSV data to PostgreSQL
migrate:
	@echo "📦 Migrating all CSV data to PostgreSQL..."
	@make migrate-telegram
	@make migrate-twitter
	@echo "✅ All data migrated successfully!"

# Migrate Telegram CSV data
migrate-telegram:
	@echo "📱 Migrating Telegram data..."
	docker-compose exec backend node scripts/migrate-telegram.js

# Migrate Twitter CSV data
migrate-twitter:
	@echo "🐦 Migrating Twitter data..."
	docker-compose exec backend node scripts/migrate-twitter.js

# View logs from all services
logs:
	docker-compose logs -f

# Clean up everything
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleanup complete!"
