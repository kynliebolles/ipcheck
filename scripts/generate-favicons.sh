#!/bin/bash

# Set the source image
SOURCE="public/logo.png"

# Create different sized PNG icons
convert "$SOURCE" -resize 16x16 "public/favicon-16x16.png"
convert "$SOURCE" -resize 32x32 "public/favicon-32x32.png"
convert "$SOURCE" -resize 180x180 "public/apple-touch-icon.png"

# Create ICO file with multiple sizes
convert "$SOURCE" -define icon:auto-resize=16,32,48,64 "public/favicon.ico"
