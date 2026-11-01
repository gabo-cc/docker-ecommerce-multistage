# syntax=docker/dockerfile:1

# ETAPA 1: Base PHP con extensiones
FROM php:8.4-fpm-alpine AS base

RUN apk add --no-cache \
    libzip \
    oniguruma \
    libxml2 \
    && apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    xml \
    zip \
    bcmath \
    opcache \
    && apk del .build-deps

WORKDIR /var/www/html


# ETAPA 2: Instalacion de Composer
FROM base AS builder

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-progress \
    --no-scripts \
    --no-autoloader

COPY . .

RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --no-scripts


# ETAPA 3: Imagen de produccion
FROM base AS production

ENV APP_ENV=production
ENV APP_DEBUG=false

COPY . .

COPY --from=builder \
    /var/www/html/vendor \
    /var/www/html/vendor

RUN mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data \
    storage bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
