@echo off

call cd mobile

call expo publish

call expo build:android

call cd ..