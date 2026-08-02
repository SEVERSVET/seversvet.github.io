# Готовит ролик к выкладке: мастер 720p + немой луп для карточки + постер.
# Профиль повторяет уже лежащие в assets/film файлы — новые не должны выбиваться.
#   .\make-film.ps1 -Src "D:\ролик.mp4" -Id evergo
# Длинная сторона мастера — 1280 (вертикаль получается 720x1280), луп — 720, 6 секунд.
param(
  [Parameter(Mandatory)][string]$Src,
  [Parameter(Mandatory)][string]$Id,
  [string]$Dest = (Join-Path $PSScriptRoot '..\assets\film'),
  # постер и луп берём не с первого кадра: там обычно затемнение или логотип
  [double]$At = 0.22
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path $Src)) { throw "нет файла: $Src" }
$Dest = (Resolve-Path $Dest).Path

$probe = ffprobe -v quiet -print_format json -show_format -show_streams $Src | ConvertFrom-Json
$v = $probe.streams | Where-Object { $_.codec_type -eq 'video' } | Select-Object -First 1
$dur = [double]$probe.format.duration
# кадр из съёмки может лежать повёрнутым — тогда местами меняются ширина и высота
$rot = [math]::Abs([int](($v.side_data_list | Where-Object { $_.rotation } | Select-Object -First 1).rotation))
$w = [int]$v.width; $h = [int]$v.height
if ($rot -eq 90 -or $rot -eq 270) { $w, $h = $h, $w }

$even = { param($n) [int]([math]::Round($n / 2) * 2) }
function Fit($w, $h, $long) {
  $k = $long / [math]::Max($w, $h)
  if ($k -ge 1) { return @($w, $h) }          # апскейлом качества не добавить
  @((& $even ($w * $k)), (& $even ($h * $k)))
}
$mw, $mh = Fit $w $h 1280
$lw, $lh = Fit $w $h 720

# длинные ролики жмём плотнее: на 12 минутах разница в CRF на глаз не видна, а вес пополам
$crf = if ($dur -gt 360) { 26 } else { 23 }
$seek = [math]::Round($dur * $At, 2)

$main  = Join-Path $Dest "$Id.mp4"
$loop  = Join-Path $Dest "$Id-loop.mp4"
$post  = Join-Path $Dest "$Id.webp"

Write-Host "[$Id] $w x $h, $([math]::Round($dur))s -> ${mw}x${mh} crf $crf"

ffmpeg -y -v error -i $Src -map 0:v:0 -map 0:a:0? `
  -vf "scale=${mw}:${mh}:flags=lanczos,format=yuv420p" `
  -c:v libx264 -preset slow -crf $crf -maxrate 2600k -bufsize 5200k `
  -profile:v high -level 4.0 -g 50 `
  -c:a aac -b:a 112k -ac 2 -movflags +faststart $main

# луп проигрывается по наведению: без звука, шесть секунд, вес важнее детализации
ffmpeg -y -v error -ss $seek -i $Src -t 6 -an `
  -vf "scale=${lw}:${lh}:flags=lanczos,format=yuv420p" `
  -c:v libx264 -preset slow -crf 30 -maxrate 700k -bufsize 1400k `
  -profile:v high -level 3.1 -g 25 -movflags +faststart $loop

# thumbnail сам выбирает самый «непохожий на соседей» кадр — вместо случайного тёмного
ffmpeg -y -v error -ss $seek -i $Src -vf "thumbnail=90,scale=${mw}:${mh}:flags=lanczos" `
  -frames:v 1 -c:v libwebp -quality 82 -compression_level 6 $post

Get-Item $main, $loop, $post | ForEach-Object {
  "  {0,-24} {1,8:N2} MB" -f $_.Name, ($_.Length / 1MB)
}
