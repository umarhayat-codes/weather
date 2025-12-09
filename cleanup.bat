@echo off
del /F /Q app\layout.js 2>nul
del /F /Q app\page.js 2>nul
del /F /Q app\WeatherCity\page.js 2>nul
del /F /Q app\slice-simulator\page.js 2>nul
del /F /Q app\api\weather\city\route.js 2>nul
del /F /Q app\api\weather\search\route.js 2>nul
del /F /Q app\api\preview\route.js 2>nul
del /F /Q app\api\exit-preview\route.js 2>nul
del /F /Q app\api\revalidate\route.js 2>nul
del /F /Q prismicio.js 2>nul
del /F /Q slices\index.js 2>nul
del /F /Q slices\WeatherOverview\index.js 2>nul
del /F /Q slices\WeatherForecast\index.js 2>nul
del /F /Q slices\WeatherDetailList\index.js 2>nul
del /F /Q slices\SearchBar\index.js 2>nul
del /F /Q slices\CenteredIntroSearch\index.js 2>nul
del /F /Q jsconfig.json 2>nul
echo Done!
